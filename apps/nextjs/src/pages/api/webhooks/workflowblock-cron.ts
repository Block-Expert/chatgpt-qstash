import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import scheduleWorkflowBlock from "@wove/api/src/utils/chat/scheduleWorkflowBlock";
import { prisma } from "@wove/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const workflowId = req.body.workflowId;
  const workflowBlockId = req.body.workflowBlockId;

  if (!workflowBlockId && !workflowId) {
    res.status(400).end();
    return;
  }

  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId },
    include: {
      blocks: true,
    },
  });

  const workflowBlock = await prisma.workflowBlock.findFirst({
    where: { id: workflowBlockId },
  });

  if (!workflow || !workflowBlock) {
    res.status(404).end();
    return;
  }

  const run = await scheduleWorkflowBlock(workflowBlock);

  await prisma.workflowRun.create({
    data: {
      startedAt: new Date(),
      endedAt: new Date(),
      workflow: {
        connect: { id: workflow?.id },
      },
      blocks: {
        create: {
          block: {
            connect: { id: run.blockId },
          },
          logs: run.logs,
          status: "SUCCESS",
          startedAt: new Date(),
        },
      },
    },
  });
  console.log("Success");
  res.status(200).end();
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
