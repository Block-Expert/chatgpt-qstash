import { useState } from "react";
// import { Button, Label, Modal, TextInput } from "flowbite-react";
import { Box, Modal, Typography } from "@mui/material";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";

export default function UserInviteModal({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const { mutateAsync: inviteUser } = api.invite.invite.useMutation();

  const [inviteEmail, setInviteEmail] = useState("");

  const handleInviteUser = async () => {
    close();
    const result = await inviteUser({
      recipient: inviteEmail,
      host: `${window.location.protocol}//${window.location.host}`,
    });
    if (result.status) {
      toast.success(result.msg);
    } else {
      toast.error(result.msg);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="m-auto absolute top-[50%] rounded-xl left-[50%] w-[600px] bg-[white] p-4 transform translate-x-[-50%] translate-y-[-50%]">
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="mb-[10px] text-center"
        >
          User Invite
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{ mt: 2 }}
          className="text-center"
        >
          Please input the user's email that you want to invite to your team.
        </Typography>
        <input
          className="mt-[20px] border p-3 w-full rounded-xl"
          placeholder="name@company.com"
          value={inviteEmail}
          onChange={(e) => {
            setInviteEmail(e.target.value);
          }}
        />
        <div className="flex m-auto gap-[4rem] p-[20px] justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleInviteUser();
            }}
            type="button"
            className="block rounded-md bg-gigas-600 py-2 px-5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gigas-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600"
          >
            Invite
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              close();
            }}
            type="button"
            className="block rounded-md bg-gray-600 py-2 px-5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gigas-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gigas-600"
          >
            Cancel
          </button>
        </div>
      </Box>
    </Modal>
  );
}
