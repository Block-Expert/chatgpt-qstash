import { NextPage } from "next";
import { useRouter } from "next/router";

import WorkflowTable from "~/components/dashboard/WorkflowTable";
import SidebarLayout from "~/components/layouts/SidebarLayout";

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
