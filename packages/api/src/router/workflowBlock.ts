import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workflowBlockRouter = createTRPCRouter({
  byId: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.prisma.workflowBlock.findFirst({
      where: { id: input },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        description: z.string(),
        prevOrder: z.number(),
        name: z.string(),
        maxLength: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Rearrange the order of the blocks
      const [_, newBlock] = await ctx.prisma.$transaction([
        ctx.prisma.workflowBlock.updateMany({
          where: {
            workflowId: input.workflowId,
            order: {
              gt: input.prevOrder,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        }),
        ctx.prisma.workflowBlock.create({
          data: {
            name: input.name,
            description: input.description,
            order: input.prevOrder + 1,
            delay: 0,
            maxLength: input.maxLength,
            workflow: {
              connect: {
                id: input.workflowId,
              },
            },
          },
        }),
      ]);

      return newBlock;
    }),
  update: protectedProcedure
    .input(
      z.object({
        blockId: z.string().min(1),
        name: z.string().optional(),
        description: z.string(),
        order: z.number().optional(),
        delay: z.number().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.workflowBlock.update({
        where: { id: input.blockId },
        data: {
          ...(input.name && { name: input.name }),
          ...{ description: input.description || "" },
          ...(input.order && { order: input.order }),
          ...(input.delay && { delay: input.delay }),
        },
      });
    }),
  moveUp: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const block = await ctx.prisma.workflowBlock.findFirstOrThrow({
        where: { id: input },
      });

      // Given a block, change its order to be one less than its current order
      // Make sure to change the order of the block before it to be one more than its current order
      const [_, newBlock] = await ctx.prisma.$transaction([
        ctx.prisma.workflowBlock.updateMany({
          where: {
            workflowId: block.workflowId,
            order: {
              gte: block.order - 1,
              lte: block.order,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        }),
        ctx.prisma.workflowBlock.update({
          where: { id: input },
          data: {
            order: block.order - 1,
          },
        }),
      ]);

      return newBlock;
    }),
  moveDown: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const block = await ctx.prisma.workflowBlock.findFirstOrThrow({
        where: { id: input },
      });

      // Given a block, change its order to be one more than its current order
      // Make sure to change the order of the block after it to be one less than its current order
      const [_, newBlock] = await ctx.prisma.$transaction([
        ctx.prisma.workflowBlock.updateMany({
          where: {
            workflowId: block.workflowId,
            order: {
              gte: block.order,
              lte: block.order + 1,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        }),
        ctx.prisma.workflowBlock.update({
          where: { id: input },
          data: {
            order: block.order + 1,
          },
        }),
      ]);

      return newBlock;
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.workflowBlock.delete({ where: { id: input } });
  }),
});
