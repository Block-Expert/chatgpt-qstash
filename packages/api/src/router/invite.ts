import * as jwt from "async-jsonwebtoken";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import sendEmail from "../utils/chat/sendGrid";

interface JWTObject {
  user: string;
  owner: string;
  expire: string;
}

export const inviteRouter = createTRPCRouter({
  acceptInvite: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      console.log(input, process.env.JTW_SECRET);
      const [decoded, err] = await jwt.verify(
        input,
        process.env.JTW_SECRET || "",
      );
      if (err) {
        return {
          status: false,
          msg: "Invalid User",
        };
      }
      const data = decoded as JWTObject;
      if (new Date() > new Date(data.expire)) {
        return {
          status: true,
          msg: "Token was expired!",
        };
      }

      const ownerTeam = await ctx.prisma.team.findFirst({
        where: { ownerId: data.owner },
      });

      await ctx.prisma.teamMember.create({
        data: {
          team: { connect: { id: ownerTeam?.id } },
          user: { connect: { id: data.user } },
          isAdmin: false,
        },
      });

      return {
        status: true,
        msg: "Accept invitation was successed!",
      };
    }),

  invite: protectedProcedure
    .input(z.object({ recipient: z.string(), host: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.recipient },
      });
      if (!user) {
        return {
          status: false,
          msg: "The user is not existing in Fruition",
        };
      }

      const myTeam = await ctx.prisma.team.findFirst({
        where: { ownerId: ctx.session.user.id },
      });

      const teamMember = await ctx.prisma.teamMember.findFirst({
        where: {
          team: {
            id: myTeam?.id,
          },
          user: {
            id: user.id,
          },
        },
      });

      if (teamMember) {
        return {
          status: false,
          msg: "Already Invited.",
        };
      }
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 5);
      const token = await jwt.sign(
        {
          user: user.id,
          owner: ctx.session.user.id,
          expire: expireDate.toString(),
        },
        process.env.JTW_SECRET || "",
      );
      const result = await sendEmail(
        input.recipient,
        "Fru.io",
        "You are invited",
        {
          username: ctx.session.user.name,
          link: `${input.host}/teams/accept-invite?token=${token[0]}`,
        },
        process.env.SEND_GRID_TEMPLATE || "",
      );
      console.log("Email Sending:", result);
      if (result) {
        return {
          status: true,
          msg: "Invite was sent",
        };
      } else {
        return {
          status: false,
          msg: "We can't send mail to him",
        };
      }
    }),
});
