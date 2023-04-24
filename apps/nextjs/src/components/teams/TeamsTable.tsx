/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import Spinner from "../primitives/Spinner";

export default function TeamsTable() {
  const { data: teams, status: teamsStatus, refetch } = api.team.all.useQuery();
  const { mutateAsync: deleteTeam } = api.teamMember.deleteTeam.useMutation();

  const router = useRouter();

  const handleDeleteTeam = async (teamId: string) => {
    await deleteTeam(teamId);
    refetch();
  };

  if (teamsStatus !== "success") {
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
            Teams
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            FI
          </p>
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
                    Members
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Flows™
                  </th>

                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-6 w-6 flex-shrink-0">
                          <UserGroupIcon className="h-6 w-6 shrink-0 text-gigas-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {team.name}
                          </div>
                          <div className="text-gray-500">{team.owner.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="text-gray-900">
                        {team.members.length} members
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {team.spaces.length} spaces
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteTeam(team.id);
                        }}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teams.length === 0 && (
              <div className="text-center p-2">There is no teams</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
