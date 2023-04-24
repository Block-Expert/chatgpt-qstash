import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import WorkflowTable from "~/components/dashboard/WorkflowTable";
import SidebarLayout from "~/components/layouts/SidebarLayout";
import Spinner from "~/components/primitives/Spinner";

const Spaces: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="h-screen">
      <SidebarLayout menu={`Space${id}`}>
        <WorkflowTable spaceId={id as string} />
      </SidebarLayout>
    </div>
  );
};

export default Spaces;
