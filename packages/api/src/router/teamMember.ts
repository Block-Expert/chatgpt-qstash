import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const teamMemberRouter = createTRPCRouter({
  deleteTeam: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const teamMember = await ctx.prisma.teamMember.findFirst({
        where: {
          teamId: input,
          userId: ctx.session.user.id,
        },
      });
      if (teamMember) {
        return ctx.prisma.teamMember.delete({
          where: {
            id: teamMember?.id,
          },
        });
      }
    }),
  deleteUser: protectedProcedure
    .input(z.object({ userId: z.string(), teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const teamMember = await ctx.prisma.teamMember.findFirst({
        where: {
          teamId: input.teamId,
          userId: input.userId,
        },
      });
      if (teamMember) {
        return ctx.prisma.teamMember.delete({
          where: {
            id: teamMember?.id,
          },
        });
      }
    }),
});
