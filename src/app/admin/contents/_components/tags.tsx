import { Tag } from "antd";

import { IoSaveOutline,IoBagCheckOutline } from "react-icons/io5";
import { MdOutlinePlaylistRemove } from "react-icons/md";

const Tags = (props: any) => {
  return (
    <Tag
      color={
        props?.status === "published"
          ? "green"
          : props?.status === "trashed"
            ? "red"
            : "blue"
      }
      variant="solid"
    >
      {props?.status ? props?.status : "Not saved"}
    </Tag>
  );
};

export default Tags;
