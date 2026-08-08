import { ViewImage } from "@/utils/viewImage";
import { Button, Card, Image, Popconfirm } from "antd";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
const ImageItem = (props: any) => {
  return (
    <Card
      size="small"
      styles={{body:{padding:0}}}
      className="mb-10 overflow-hidden"
    >
      <Image
        src={ViewImage(props?.item?.name)}
        width={"100%"}
        height={130}
        className="object-cover"
      />
      <div className="p-2">
        <div className="mb-2 text-[12px] font-medium">{props?.item?.name}</div>
        <div className="flex items-center justify-end gap-2">
          <div className="flex-1" />
          <Button
            size="small"
            onClick={() => props?.copyImage(ViewImage(props?.item?.name))}
            className="p-1!"
          >
            <IoCopyOutline size={15} color="green" />
          </Button>
          <Button
            size="small"
            onClick={() => props?.handleDownload(ViewImage(props?.item?.name))}
            className="p-1!"
          >
            <IoCloudDownloadOutline size={15} color="blue" />
          </Button>
          <Popconfirm
            title="Delete the file"
            description="Are you sure to delete this file?"
            onConfirm={() => props?.onDelete(props?.item)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button size="small" danger type="dashed" className="p-1!">
              <RiDeleteBin6Line size={15} />
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

export default ImageItem;
