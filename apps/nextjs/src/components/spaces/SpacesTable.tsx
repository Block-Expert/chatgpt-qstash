/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useRouter } from "next/router";
import { CreditCardIcon } from "@heroicons/react/20/solid";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { Input } from "postcss";
import { toast } from "react-hot-toast";
import { Space, User } from "@wove/db";

import { api } from "~/utils/api";
import { useSpaces } from "~/context/spaces";
import UserInviteModal from "../modal/UserInviteModal";
import Spinner from "../primitives/Spinner";

export default function SpacesTable({ teamId }: { teamId: string }) {
  const { mutateAsync: createSpace } = api.space.create.useMutation();
  const { mutateAsync: updateSpace } = api.space.update.useMutation();
  const { mutateAsync: deleteSpace } = api.space.delete.useMutation();
  const { data: mineteam, refetch: refetchMineTeam } = api.team.mine.useQuery();
  const { setSpaces } = useSpaces();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editName, setEditName] = useState("");

  const {
    data: team,
    status: teamStatus,
    refetch,
  } = api.team.byId.useQuery(teamId as string, {
    refetchOnWindowFocus: false,
  });

  const handleCreateSpace = async () => {
    await createSpace({
      name: "My new Space",
      teamId: teamId,
    });
    await refetch();
    await updateSideBar();
    toast.success("Space was created!");
  };

  const updateSideBar = async () => {
    if (teamId === mineteam?.id) {
      const updatedMineTeam = await refetchMineTeam();
      if (updatedMineTeam?.data) {
        setSpaces(updatedMineTeam.data?.spaces);
      }
    }
  };

  const handleEdit = async () => {
    await updateSpace({
      name: editName,
      id: editingId,
    });
    await refetch();
    await updateSideBar();
    toast.success("Space was updated!");
  };

  const handleDelete = async (id: string) => {
    await deleteSpace(id);
    await refetch();
    await updateSideBar();
    toast.success("Space was deleted!");
  };

  if (teamStatus === "loading") {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (teamStatus === "error" || !teamStatus) {
    return <div>Error!</div>;
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Spaces
          </h1>
          <h2 className="italic">Owner: {team?.owner?.name}</h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all of your spaces in this team.
          </p>
        </div>
        {teamId === mineteam?.id && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
              type="button"
              className="block rounded-md bg-gigas-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-gigas-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600"
            >
              Invite User
            </button>
          </div>
        )}
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={(e) => {
              e.preventDefault();
              void handleCreateSpace();
            }}
            type="button"
            className="block rounded-md bg-gigas-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-gigas-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600"
          >
            Create Space
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Workflows
                  </th>

                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {team?.spaces?.map(({ id, name, workflows }) => (
                  <tr key={id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-6 w-6 flex-shrink-0">
                          <CreditCardIcon className="h-6 w-6 shrink-0 text-gigas-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {id === editingId ? (
                              <input
                                type="text"
                                name="name"
                                id="name"
                                className="block w-full shadow-sm sm:text-sm focus:ring-gigas-500 focus:border-gigas-500 border-gray-300 rounded-md"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />
                            ) : (
                              <span>{name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {workflows?.length}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (id === editingId) {
                            handleEdit();
                            setEditingId("");
                          } else {
                            setEditingId(id);
                            setEditName(name);
                          }
                        }}
                        className="text-gray-600 hover:text-gray-900 ml-4"
                      >
                        {id === editingId ? (
                          <span className="text-[green]">Save</span>
                        ) : (
                          <span>Edit</span>
                        )}
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(id);
                        }}
                        className="text-red-600 hover:text-gray-900 ml-4"
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <UserInviteModal open={showModal} close={() => setShowModal(false)} />
    </div>
  );
}
