import { Badge, Button, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/util/hooks";
import { LogOut, ShieldUser, UserPen } from "lucide-react";

import { ImageLoader } from "@/util/imageLoader";
import { logout } from "@/redux/slice/userSlice";

export default function ProfilePopover(props: any) {
  const navigation = useRouter();
  const dispatch = useAppDispatch();
  const logouts = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content:
        " You will be logged out of your account and redirected to the login page.",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      onOk() {
        dispatch(logout({}));
        navigation.push("/");
      },
    });
  };
  return (
    <div style={{ width: 200, textAlign: "center" }}>
      <br />
      <Badge color="green" dot={true}>
        <Image
          alt="profile"
          width={0}
          height={0}
          style={{
            borderRadius: "100%",
            objectFit: "cover",
            width: 50,
            height: 50,
          }}
          src={"/placeholder.png"}
          loader={ImageLoader}
        />
      </Badge>
      <div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 16 }}>
            {props?.item?.user?.name}
          </div>
          <div className="mb-2">{props?.item?.user?.email}</div>
        </div>
      </div>

      <Button
        block
        size="small"
        style={{ borderRadius: 100, fontSize: 12 }}
        onClick={() => navigation.push("/profile")}
      >
        <UserPen color="green" size={15} />
        Manage your account
      </Button>
      {props?.item?.user?.type === "editor" ? (
        <Button
          block
          size="small"
          type="primary"
          ghost
          style={{ borderRadius: 100, fontSize: 12, marginTop: 10 }}
          onClick={() => navigation.push("/admin/dashboard")}
        >
          <ShieldUser size={15} />
          Open Admin Panel
        </Button>
      ) : null}
      <Button
        block
        size="small"
        style={{ borderRadius: 100, fontSize: 12, marginTop: 10 }}
        ghost
        danger
        onClick={() => logouts()}
      >
        <LogOut size={15} />
        Logout
      </Button>
    </div>
  );
}
