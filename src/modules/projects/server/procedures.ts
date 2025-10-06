import z from 'zod';
import { generateSlug } from 'random-word-slugs';
import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/prisma';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: 'Value cannot be empty' })
          .max(10000, { message: 'Value is too long' }),
        projectId: z.string().min(1, { message: 'Project ID is required' }),
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, { format: 'kebab' }),
          messages: {
            create: {
              content: input.value,
              role: MessageRole.USER,
              type: MessageType.RESULT,
            },
          },
        },
      });

      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});
