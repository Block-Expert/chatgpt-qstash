import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import SidebarLayout from "~/components/layouts/SidebarLayout";
import Spinner from "~/components/primitives/Spinner";
import UsersTable from "~/components/users/UsersTable";

const Users: NextPage = () => {
  const { data: userData, status: userStatus } = useSession();
  const router = useRouter();

  if (userStatus === "loading") {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (userStatus === "unauthenticated" || !userData) {
    void router.push("/login");
    return null;
  }

  return (
    <div className="h-screen">
      <SidebarLayout menu="Users">
        <UsersTable />
      </SidebarLayout>
    </div>
  );
};

export default Users;
