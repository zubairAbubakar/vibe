import { openai, gemini, createAgent } from '@inngest/agent-kit';

import { inngest } from './client';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },

  async ({ event, step }) => {
    const codeAgent = createAgent({
      name: 'code-agent',
      system:
        'You are an expert nextjs developer. You write readable, maintainable code. You write simple Next.js & React code snippets.',
      model: gemini({ model: 'gemini-2.0-flash' }),
    });

    const { output } = await codeAgent.run(
      `Write the following code snippet: ${event.data.value}`
    );

    return { output };
  }
);
