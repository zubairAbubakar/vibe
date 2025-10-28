import { Sandbox } from '@e2b/code-interpreter';
import {
  createAgent,
  createTool,
  createNetwork,
  openai,
  type Tool,
  type Message,
  createState,
} from '@inngest/agent-kit';

import { inngest } from './client';
import { getSandbox, lastAssistantTextMessageContent } from './utils';
import {
  FRAGMENT_TITLE_PROMPT,
  PROMPT,
  RESPONSE_PROMPT,
  HTML5_GAME_PROMPT,
  HTML5_GAME_TITLE_PROMPT,
  HTML5_GAME_RESPONSE_PROMPT,
} from '@/prompts';
import z from 'zod';
import { prisma } from '@/lib/prisma';
import { MessageRole, MessageType } from '@/generated/prisma';
import { SANDBOX_TIMEOUT } from './types';

interface AgentState {
  summary?: string;
  files: { [path: string]: string };
}

// Helper function to detect game-related requests
function isGameRequest(userInput: string): boolean {
  const gameKeywords = [
    'game',
    'play',
    'platformer',
    'shooter',
    'puzzle',
    'runner',
    'arcade',
    'pong',
    'snake',
    'tetris',
    'flappy',
    'match-3',
    'racing',
  ];
  const lowercaseInput = userInput.toLowerCase();
  return gameKeywords.some((keyword) => lowercaseInput.includes(keyword));
}

export const codeAgentFunction = inngest.createFunction(
  { id: 'code-agent' },
  { event: 'code-agent/run' },
  async ({ event, step }) => {
    // Determine if this is a game request early
    const isGame = isGameRequest(event.data.value);

    const sandboxId = await step.run('get-sandbox-id', async () => {
      // Use game-specific template for game requests
      const templateId = isGame
        ? 'gnh6zy51yg62wzvq6y34' // HTML5 game template with Phaser, PixiJS, Howler
        : 'fba2w2kbrhzusocdi5qj'; // Standard Next.js template
      const sandbox = await Sandbox.create(templateId);
      await sandbox.setTimeout(SANDBOX_TIMEOUT);
      return sandbox.sandboxId;
    });
    const previousMessages = await step.run(
      'get-previous-messages',
      async () => {
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: 'text',
            content: message.content,
            role: message.role === 'ASSISTANT' ? 'assistant' : 'user',
          });
        }
        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        files: {},
        summary: '',
      },
      { messages: previousMessages }
    );

    const codeAgent = createAgent<AgentState>({
      name: 'code-agent',
      description:
        'An AI agent that can write and execute code in a code interpreter sandbox.',
      system: isGame ? HTML5_GAME_PROMPT : PROMPT,
      model: openai({ model: 'gpt-4.1' }),
      tools: [
        createTool({
          name: 'terminal',
          description:
            'Use the terminal to run commands in the code interpreter sandbox.',
          handler: async ({ command }: { command: string }, { step }) => {
            return await step?.run('terminal', async () => {
              const buffer = { stdout: '', stderr: '' };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffer.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffer.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.error(
                  `Command failed: ${error} \nstdout: ${buffer.stdout} \nstderr: ${buffer.stderr}`
                );
                return `Command failed: ${error} \nstdout: ${buffer.stdout} \nstderr: ${buffer.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: 'createOrUpdateFiles',
          description:
            'Create or update files in the code interpreter sandbox.',
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              'createOrUpdateFiles',
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (error) {
                  return {
                    error: `Failed to create or update files: ${error}`,
                  };
                }
              }
            );

            if (typeof newFiles === 'object') {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: 'readFiles',
          description: 'Read files in the code interpreter sandbox.',
          handler: async ({ files }: { files: string[] }) => {
            return await step?.run('readFiles', async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return {
                  error: `Failed to read files: ${error}`,
                };
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessage = lastAssistantTextMessageContent(result);
          if (lastAssistantMessage && network) {
            if (lastAssistantMessage.includes('<task_summary>')) {
              network.state.data.summary = lastAssistantMessage;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: 'coding-agent-network',
      agents: [codeAgent],
      maxIter: isGame ? 25 : 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: 'fragment-title-generator',
      description:
        'Generates a title for a code fragment based on its task summary.',
      system: isGame ? HTML5_GAME_TITLE_PROMPT : FRAGMENT_TITLE_PROMPT,
      model: openai({ model: 'gpt-4o' }),
    });

    const responseGenerator = createAgent({
      name: 'response-generator',
      description:
        'Generates a response for a code fragment based on its task summary.',
      system: isGame ? HTML5_GAME_RESPONSE_PROMPT : RESPONSE_PROMPT,
      model: openai({ model: 'gpt-4o' }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary!
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary!
    );

    const generateFragmentTitle = () => {
      if (fragmentTitleOutput[0].type !== 'text') return 'Fragment';

      if (Array.isArray(fragmentTitleOutput[0].content)) {
        return fragmentTitleOutput[0].content.map((text) => text).join(' ');
      } else {
        return fragmentTitleOutput[0].content;
      }
    };

    const generateResponse = () => {
      if (responseOutput[0].type !== 'text') return 'Here you go!';

      if (Array.isArray(responseOutput[0].content)) {
        return responseOutput[0].content.map((text) => text).join(' ');
      } else {
        return responseOutput[0].content;
      }
    };

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run('save-result', async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: 'Error occurred while processing request',
            role: MessageRole.ASSISTANT,
            type: MessageType.RESULT,
          },
        });
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generateResponse(),
          role: MessageRole.ASSISTANT,
          type: MessageType.RESULT,
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: generateFragmentTitle(),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: 'Fragment',
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
