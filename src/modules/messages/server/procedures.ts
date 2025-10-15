import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/prisma';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import z from 'zod';

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: 'Project ID is required' }),
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: { projectId: input.projectId },
        include: { fragment: true },
        orderBy: { createdAt: 'asc' },
      });
      return messages;
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: 'Message cannot be empty' })
          .max(10000, { message: 'Message is too long' }),
        projectId: z.string().min(1, { message: 'Project ID is required' }),
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: MessageRole.USER,
          type: MessageType.RESULT,
          project: {
            connect: { id: input.projectId },
          },
        },
      });

      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });

      return createdMessage;
    }),
});
