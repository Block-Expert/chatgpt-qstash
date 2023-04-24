import { authRouter } from "./router/auth";
import { inviteRouter } from "./router/invite";
import { spacesRouter } from "./router/spaces";
import { teamRouter } from "./router/team";
import { teamMemberRouter } from "./router/teamMember";
import { usersRouter } from "./router/users";
import { workflowRouter } from "./router/workflow";
import { workflowBlockRouter } from "./router/workflowBlock";
import { workflowRunRouter } from "./router/workflowRun";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  team: teamRouter,
  teamMember: teamMemberRouter,
  users: usersRouter,
  space: spacesRouter,
  invite: inviteRouter,
  workflow: workflowRouter,
  workflowBlock: workflowBlockRouter,
  workflowRun: workflowRunRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
