import { Button, Form } from "antd";
import { AiOutlineSave } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";

const FormFooter = (props: any) => {
  return (
    <div className="absolute bottom-0 left-0 sm:left-60 w-full sm:w-[calc(100%-15rem)] z-1000 p-2 h-[7vh] bg-white flex flex-row items-center gap-2.5 shadow-[0_-2px_3px_rgba(180,180,180,0.1)]">
      {props?.loading1 ? <Button loading={props?.loading1}></Button> : null}
      <Form.Item name={"status"} noStyle hidden>
        <input type="hidden" />
      </Form.Item>
      {props?.data?.status && props?.data?.status !== "trashed" ? (
        <Form.Item noStyle>
          <Button
            loading={props?.loading2}
            danger
            onClick={() => props?.trash()}
            className="p-3!"
          >
            <IoTrashOutline />
            <span className="hidden sm:inline">Move to trash</span>
          </Button>
        </Form.Item>
      ) : null}

      <div style={{ flex: 1 }} />
      <Form.Item noStyle>
        <Button
          type="primary"
          ghost
          icon={<AiOutlineSave />}
          loading={props?.loading3}
          onClick={() => props?.save()}
        >
          {props?.data?.status ? "Update" : "Save"}
        </Button>
      </Form.Item>
      <Form.Item noStyle>
        <Button
          disabled={props?.data?.status === "published" ? true : false}
          type="primary"
          icon={<IoIosCheckmarkCircleOutline />}
          loading={props?.loading4}
          onClick={() => props?.publish()}
        >
          Publish
        </Button>
      </Form.Item>
    </div>
  );
};

export default FormFooter;
