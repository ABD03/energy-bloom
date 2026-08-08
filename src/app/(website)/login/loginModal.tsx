import React from "react";
import { Modal } from "antd";
import LoginForm from "./loginForm";

const LoginModal = (props: any) => {
  return (
    <Modal
      open={props?.open}
      onCancel={() => props?.close()}
      centered
      width={400}
      footer={false}
      destroyOnHidden
    >
      <div className="py-4">

     <LoginForm onSuccess={() => props?.close()} />
      </div>
    </Modal>
  );
};

export default LoginModal;
