import { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, Card } from "flowbite-react";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";

const AcceptInvite: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const { mutateAsync: acceptInvite } = api.invite.acceptInvite.useMutation();

  const handleAccept = async () => {
    const result = await acceptInvite((token as string) || "");
    if (result.status) {
      toast.success(result.msg);
    } else {
      toast.error(result.msg);
    }
    void router.push("/login");
  };

  const handleCancel = () => {
    void router.push("/login");
  };

  return (
    <div className="h-screen">
      <div className="m-auto mt-[10%] w-[500px]">
        <Card className="p-5">
          <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
            Fru.io
          </h5>
          <p className="text-[1.2rem] text-gray-700 dark:text-gray-400 mt-[2rem]">
            You are invited to a team.
          </p>
          <p className="text-[1.2rem] text-gray-700 dark:text-gray-400 mt-[1rem]">
            Please accept invitation and enjoy with your team.
          </p>
          <div className="mt-[2rem] flex gap-[2rem] justify-center">
            <Button className="bg-gigas-600" onClick={handleAccept}>
              Accept
            </Button>

            <Button className="bg-gray-600" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvite;
