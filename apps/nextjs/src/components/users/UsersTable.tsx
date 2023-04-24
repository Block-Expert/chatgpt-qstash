/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import UserInviteModal from "../modal/UserInviteModal";
import Spinner from "../primitives/Spinner";

export default function UsersTable() {
  const {
    data: myTeam,
    status: myTeamStatus,
    refetch,
  } = api.team.mine.useQuery();
  const { mutate: deleteUser } = api.teamMember.deleteUser.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  if (myTeamStatus !== "success") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all of users in your team.
          </p>
        </div>
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
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Email Verify
                  </th>

                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {myTeam?.members.map((member) => (
                  <tr key={member.user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-6 w-6 flex-shrink-0">
                          <img
                            className="h-6 w-6 rounded-full mx-auto"
                            src={
                              member.user.image ??
                              "https://em-content.zobj.net/thumbs/240/apple/354/light-bulb_1f4a1.png"
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {member.user.name}
                          </div>
                          <div className="text-gray-500">
                            {member.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    {member.user.id === myTeam.ownerId ? (
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Owner(Me)
                        </span>
                      </td>
                    ) : (
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                          Member(Invited)
                        </span>
                      </td>
                    )}
                    {member.user.emailVerified ? (
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Verified
                        </span>
                      </td>
                    ) : (
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                          Not Verified
                        </span>
                      </td>
                    )}
                    {member.user.id !== myTeam.ownerId && (
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteUser({
                              teamId: myTeam.id,
                              userId: member.userId,
                            });
                          }}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Delete
                        </a>
                      </td>
                    )}
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
