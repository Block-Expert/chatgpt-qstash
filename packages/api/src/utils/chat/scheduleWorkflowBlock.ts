import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { WorkflowBlock } from "@wove/db";

async function scheduleWorkflowBlock(workflowBlock: WorkflowBlock) {
  console.log("Starting workflowBlock...");

  const chat = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL_NAME ?? "gpt-3.5-turbo",
  });
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a friendly conversation between a human and an AI. The AI is straight-to-the-point and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. If the user asks for a list, the AI should give the list directly without adding text before or after the list. If appropriate, you can return some or all of your response as Markdown. This includes using appropriate headings, lists, code snippets, Mermaid diagrams, etc.",
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{text}"),
  ]);
  const chain = new ConversationChain({
    memory: new BufferMemory({
      returnMessages: true,
      memoryKey: "history",
    }),
    prompt: chatPrompt,
    llm: chat,
  });

  // For each block, we want to call the chain with the block's text.
  const run: {
    blockId: string;
    logs: string;
  } = {
    blockId: "",
    logs: "",
  };

  const res = await chain.call({
    text: workflowBlock.description,
  });
  if ("response" in res) {
    run.blockId = workflowBlock.id;
    run.logs = res.response;
  }

  console.log("WorkflowBlock complete.");
  return run;
}

export default scheduleWorkflowBlock;
