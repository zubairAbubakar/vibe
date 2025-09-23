import { Sandbox } from '@e2b/code-interpreter';
import { gemini, createAgent, createTool } from '@inngest/agent-kit';

import { inngest } from './client';
import { getSandbox } from './utils';
import { tr } from 'date-fns/locale';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },

  async ({ event, step }) => {
    const sandboxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('vibe-nextjs-test__-3');
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: 'code-agent',
      system:
        'You are an expert nextjs developer. You write readable, maintainable code. You write simple Next.js & React code snippets.',
      model: gemini({ model: 'gemini-2.0-flash' }),
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
          handler: async (
            { files }: { files: Array<{ path: string; content: string }> },
            { step, network }
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
      ],
    });

    const { output } = await codeAgent.run(
      `Write the following code snippet: ${event.data.value}`
    );

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);
