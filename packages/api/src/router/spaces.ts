import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spacesRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({
      orderBy: { id: "desc" },
      include: {
        team: true,
        workflows: true,
      },
    });
  }),
  byId: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.prisma.space.findFirst({
      where: { id: input },
      include: {
        team: true,
        workflows: true,
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string(), teamId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.space.create({
        data: {
          name: input.name || "Personal Space",
          team: {
            connect: { id: input.teamId },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.space.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.space.delete({ where: { id: input } });
  }),
});
