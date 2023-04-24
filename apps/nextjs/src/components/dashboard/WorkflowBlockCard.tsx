import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { PencilIcon } from "@heroicons/react/24/outline";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { WorkflowBlock, WorkflowBlockRun } from "@prisma/client";
import { CheckIcon, Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import dayjs, { Dayjs } from "dayjs";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

import { api } from "~/utils/api";

export default function WorkflowBlockCard({
  block,
  logsHidden,
  setLogsHidden,
}: {
  block: WorkflowBlock & {
    runs: WorkflowBlockRun[];
  };
  logsHidden: boolean;
  setLogsHidden: (hidden: boolean) => void;
}) {
  const utils = api.useContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(block.name);
  const [prompt, setPrompt] = useState<string>(block.description || "");
  const [delayedTime, setDelayedTime] = useState(block.delay || 0);
  const [scheduledAt, setDateTime] = useState<Dayjs | null>(
    dayjs(new Date()).add(delayedTime, "minute"),
  );

  const handleScheduleTime = (value: any) => {
    setDateTime(value);
    const diffMins: number =
      (new Date(value).getTime() - new Date().getTime()) / 1000 / 60; // minutes
    const delay = diffMins > 0 ? Math.round(diffMins) : 0;
    setDelayedTime(delay);
  };

  const { mutate: deleteBlock } = api.workflowBlock.delete.useMutation({
    async onSuccess() {
      await utils.workflow.invalidate();
    },
  });
  const { mutate: updateBlock } = api.workflowBlock.update.useMutation({
    async onSuccess() {
      await utils.workflow.invalidate();
    },
  });
  const { mutate: moveUp } = api.workflowBlock.moveUp.useMutation({
    async onSuccess() {
      await utils.workflow.invalidate();
    },
  });
  const { mutate: moveDown } = api.workflowBlock.moveDown.useMutation({
    async onSuccess() {
      await utils.workflow.invalidate();
    },
  });

  const lastRun = block.runs[block.runs.length - 1];

  return (
    <div className="shadow-md rounded-lg bg-white border border-stone-50">
      <div className="bg-white px-4 py-5 sm:px-6">
        <div className="flex space-x-3">
          <div className="min-w-0 flex w-full h-12 items-center">
            {isEditing ? (
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full h-full shadow-sm sm:text-sm focus:ring-gigas-500 focus:border-gigas-500 border-gray-300 rounded-md"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{nameInput}</p>
            )}
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="w-full max-w-fit"
              disabled={!isEditing}
              value={scheduledAt}
              minDate={dayjs(new Date())}
              maxDate={dayjs(new Date()).add(90, "day")}
              onChange={(value) => handleScheduleTime(value)}
            />
          </LocalizationProvider>
          <div className="flex flex-shrink-0 self-center">
            <span className="isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => moveUp(block.id)}
                className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              >
                <span className="sr-only">Move up</span>
                <ChevronUpIcon className="h-10 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveDown(block.id)}
                className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              >
                <span className="sr-only">Move down</span>
                <ChevronDownIcon className="h-10 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    updateBlock({
                      blockId: block.id,
                      name: nameInput,
                      description: prompt,
                      delay: delayedTime,
                    });
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              >
                <span className="sr-only">{isEditing ? "Save" : "Edit"}</span>
                {isEditing ? (
                  <CheckIcon
                    className="h-10 w-5 text-green-700"
                    aria-hidden="true"
                  />
                ) : (
                  <Pencil1Icon className="h-10 w-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  // TODO: Add some kind of warning message here
                  deleteBlock(block.id);
                  toast.success("Block deleted");
                }}
                className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              >
                <span className="sr-only">Delete</span>
                <XMarkIcon className="h-10 w-5" aria-hidden="true" />
              </button>
            </span>
          </div>
        </div>
        <div className="py-4">
          {isEditing ? (
            <textarea
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-gigas-500 focus:border-gigas-500 sm:text-sm"
              value={prompt}
              maxLength={block.maxLength}
              onChange={(e) => setPrompt(e.target.value)}
            />
          ) : (
            <ReactMarkdown className="text-gray-600">
              {block.description || "No prompt"}
            </ReactMarkdown>
          )}
        </div>
        <div className="flex justify-end gap-2 text-gray-500 text-[0.8rem]">
          <PencilIcon width="15px" /> <span>Max Length:{block.maxLength}</span>
        </div>
        {lastRun?.logs?.length ? (
          <div>
            <button
              type="button"
              className="flex items-start text-gray-400 hover:text-gray-600 -ml-1"
              onClick={() => setLogsHidden(!logsHidden)}
            >
              {logsHidden ? (
                <>
                  <ChevronDownIcon className="h-10 w-5 text-gray-400" />
                  <span className="text-gray-600 text-sm">Show output</span>
                </>
              ) : (
                <>
                  <ChevronUpIcon className="h-10 w-5 text-gray-400" />
                  <span className="text-gray-600 text-sm">Hide output</span>
                </>
              )}
            </button>
          </div>
        ) : null}

        {lastRun && !logsHidden && (
          <div className="pt-4">
            <div className="flex flex-col gap-y-4">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1
                      className="my-2 text-gray-900 text-lg font-semibold"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => (
                    <p
                      className="text-gray-700 my-1 text-sm font-text"
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => (
                    <li className="text-gray-600 my-1 text-sm" {...props} />
                  ),
                }}
                className="text-gray-600"
              >
                {lastRun.logs || ""}
              </ReactMarkdown>
              <p className="text-gray-600 text-sm">
                Last run: {lastRun.startedAt?.toLocaleDateString()}
                {lastRun.startedAt?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
