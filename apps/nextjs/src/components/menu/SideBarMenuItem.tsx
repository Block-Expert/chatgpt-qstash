import Link from "next/link";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function SideBarMenuItem({
  name,
  link,
  active,
}: {
  name: string;
  link: string;
  active: boolean;
}) {
  return (
    <Link href={link}>
      <li>
        <div
          className={clsx(
            active
              ? "bg-gray-50 text-gigas-600"
              : "text-gray-700 hover:text-gigas-600 hover:bg-gray-50",
            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
          )}
        >
          <BriefcaseIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">{name}</span>
        </div>
      </li>
    </Link>
  );
}
