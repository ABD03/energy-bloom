"use client";
import React, { useState } from "react";
import { Button, Card, Form, Input, message, Modal, Switch } from "antd";

function FormModal(props: any) {

  return (
    <Modal
      maskClosable={false}
      title={`${props?.data?._id ? `Edit` : "Create new"} category`}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={400}
      centered
    >
    </Modal>
  );
}

export default FormModal;
