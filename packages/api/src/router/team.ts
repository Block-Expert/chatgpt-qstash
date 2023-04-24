import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const teamRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.team.findMany({
      include: {
        members: true,
        spaces: true,
        owner: true,
      },
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
            isAdmin: false,
          },
        },
      },
    });
  }),
  mine: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.team.findFirst({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        spaces: {
          include: {
            workflows: true,
          },
          orderBy: {
            id: "asc",
          },
        },
      },
      where: { ownerId: ctx.session?.user.id },
    });
  }),
  byId: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.prisma.team.findFirst({
      where: { id: input },
      include: {
        spaces: {
          include: {
            workflows: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        owner: true,
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.team.create({
        data: {
          name: input.name || "Untitled team",
          owner: {
            connect: { id: ctx.session?.user.id },
          },
        },
      });
    }),
});
