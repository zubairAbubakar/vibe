import { Sandbox } from '@e2b/code-interpreter';
import { openai, gemini, createAgent } from '@inngest/agent-kit';

import { inngest } from './client';
import { get } from 'http';
import { getSandbox } from './utils';

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
