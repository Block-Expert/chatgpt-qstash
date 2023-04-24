import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  CreditCardIcon,
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

import { api } from "~/utils/api";
import { useSpaces } from "~/context/spaces";
import SideBarMenuItem from "../menu/SideBarMenuItem";
import Spinner from "../primitives/Spinner";

const navigation = [
  { name: "Dashboard", href: "/app", icon: HomeIcon, current: true },
];

export default function SidebarLayout({
  children,
  menu,
}: {
  children: React.ReactNode;
  menu: String;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { spaces, setSpaces } = useSpaces();
  const { data: team, status: teamStatus } = api.team.mine.useQuery();
  const { data: teams, status: teamsStatus } = api.team.all.useQuery();

  useEffect(() => {
    if (team) {
      setSpaces(team.spaces);
    }
  }, [team]);

  if (teamsStatus !== "success") {
    return (
      <div className="flex flex-col h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Fru.io
                    </h3>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={clsx(
                                  item.name === menu
                                    ? "bg-gray-50 text-gigas-600"
                                    : "text-gray-700 hover:text-gigas-600 hover:bg-gray-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                )}
                              >
                                <item.icon
                                  className={clsx(
                                    item.name === menu
                                      ? "text-gigas-600"
                                      : "text-gray-400 group-hover:text-gigas-600",
                                    "h-6 w-6 shrink-0",
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <Link href={"/teams/"}>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Your teams
                          </div>
                        </Link>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {teams.map((team) => (
                            <li key={team.name}>
                              <div
                                className={clsx(
                                  "bg-gray-50 text-gigas-600",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                )}
                              >
                                <span
                                  className={clsx(
                                    "text-gigas-600 border-gigas-600",
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white",
                                  )}
                                >
                                  {team.name
                                    .split(" ")
                                    .map((word) => word[0]?.toUpperCase() || "")
                                    .join("")}{" "}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <Link
                          href="/app/settings"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-gigas-600"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-gigas-600"
                            aria-hidden="true"
                          />
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="max-w-[70%]"
              src="https://cdn.fru.io/fruitionlogosmall.png"
              alt="AI Workflows"
            />
          </div>
          <nav className="flex flex-1 flex-col cursor-pointer">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          item.name === menu
                            ? "bg-gray-50 text-gigas-600"
                            : "text-gray-700 hover:text-gigas-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                        )}
                      >
                        <item.icon
                          className={clsx(
                            item.name === menu
                              ? "text-gigas-600"
                              : "text-gray-400 group-hover:text-gigas-600",
                            "h-6 w-6 shrink-0",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link href={`/teams/${team?.id}`}>
                  <div className="text-sm font-semibold leading-6 text-gigas-600">
                    WTWON®
                  </div>
                </Link>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {spaces.map((space) => (
                    <SideBarMenuItem
                      key={space.id}
                      name={space.name}
                      link={`../spaces/${space.id}`}
                      active={`Space${space.id}` === menu}
                    />
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  My Teams
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.id}>
                      <div
                        className={clsx(
                          `Teams${team.id}` === menu
                            ? "bg-gray-50 text-gigas-600"
                            : "text-gray-700 hover:text-gigas-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                        )}
                      >
                        <UserGroupIcon className="h-6 w-6 shrink-0" />
                        <Link href={`/teams/${team?.id}`}>
                          <span className="truncate">
                            Team({team.owner.name})
                          </span>
                        </Link>
                        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                          {team.members.length}
                        </span>
                      </div>
                      <div className="pl-5">
                        <ul role="list" className="space-y-1">
                          {team.spaces?.map((space) => (
                            <SideBarMenuItem
                              key={space.id}
                              name={space.name}
                              link={`../spaces/${space.id}`}
                              active={`Space${space.id}` === menu}
                            />
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="/app/settings"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-gigas-600"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-gigas-600"
                    aria-hidden="true"
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
