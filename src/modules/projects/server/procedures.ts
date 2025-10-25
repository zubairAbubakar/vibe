import z from 'zod';
import { generateSlug } from 'random-word-slugs';
import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/prisma';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { consumeCredits } from '@/lib/usage';

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: 'ID is required' }),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return existingProject;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: { userId: ctx.auth.userId },
      orderBy: { createdAt: 'desc' },
    });
    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: 'Value cannot be empty' })
          .max(10000, { message: 'Value is too long' }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        } else {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message:
              'Usage credit limit exceeded, consider upgrading your plan.',
          });
        }
      }

      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, { format: 'kebab' }),
          userId: ctx.auth.userId,
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
