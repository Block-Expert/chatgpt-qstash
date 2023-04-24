import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import SidebarLayout from "~/components/layouts/SidebarLayout";
import Spinner from "~/components/primitives/Spinner";
import SpacesTable from "~/components/spaces/SpacesTable";
import TeamsTable from "~/components/teams/TeamsTable";

const TeamPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="h-screen">
      <SidebarLayout menu={`Teams${id}`}>
        <SpacesTable teamId={id as string} />
      </SidebarLayout>
    </div>
  );
};

export default TeamPage;
