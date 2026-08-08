"use client";

import { useState } from "react";
import { Button, Input, message, Modal } from "antd";
import { useRouter } from "next/navigation";
import { IoWarningOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useAppDispatch } from "@/redux/util/hooks";
import { logout as logoutAction } from "@/redux/slice/userSlice";
import { DELETE } from "@/utils/apiCalls";
import { API } from "@/config/apis";

interface DeleteFormProps {
  user: any;
}

export default function DeleteForm({ user }: DeleteFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response: any = await DELETE(
        `${API.DELETE_ACCOUNT}?id=${user?._id}`,
      );
      if (response?.status) {
        document.cookie = "token=; path=/; max-age=0";
        dispatch(logoutAction({} as any));
        message.success("Account deleted successfully");
        router.push("/");
      } else {
        message.error(response?.message || "Failed to delete account");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
      setReason("");
    }
  };

  return (
    <>
      <div className="mt-6 bg-red-500/10 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <IoWarningOutline
            size={20}
            className="text-red-500 mt-0.5 shrink-0"
          />
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-600 mb-1">
              Delete Account
            </div>
            <ul className="text-xs text-red-500/80 list-disc pl-4 space-y-1">
              <li>
                Your profile and personal data will be permanently removed
              </li>
              <li>All your bookmarks and saved content will be deleted</li>
              <li>
                You will lose access to your account and cannot recover it
              </li>
              <li>Any active subscriptions will be cancelled immediately</li>
            </ul>
          </div>
          <Button
            danger
            size="small"
            icon={<RiDeleteBin6Line size={14} />}
            onClick={() => setOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Modal
        open={open}
        width={400}
        centered
        title="Confirm Account Deletion"
        onCancel={() => {
          setOpen(false);
          setReason("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setOpen(false);
              setReason("");
            }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            danger
            type="primary"
            loading={loading}
            disabled={!reason.trim()}
            onClick={handleDelete}
          >
            Delete My Account
          </Button>,
        ]}
      >
        <div className="py-2">
          <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <IoWarningOutline
              size={18}
              className="text-red-500 mt-0.5 shrink-0"
            />
            <div className="text-xs text-red-600">
              This will permanently delete your account, bookmarks, and all
              associated data. This action cannot be undone.
            </div>
          </div>
          <div className="text-sm font-medium mb-2">
            Please tell us why you are leaving
          </div>
          <Input.TextArea
            rows={6}
            placeholder="Your reason for deleting..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
