"use client";
import { dayjs } from "@/utils/common";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { Button, message } from "antd";
import { MdOutlineCloudUpload } from "react-icons/md";

const Upload = (props: any) => {
  const handleDrop = (acceptedFiles: any) => {
    try {
      const maxFileSize = 2 * 1024 * 1024;
      var myFile = acceptedFiles[0];
      const ext = myFile.name.split(".").pop();
      if (!myFile.type.startsWith("image/")) {
        message.error("Only image files are allowed.");
      } else {
        if (myFile.size > maxFileSize) {
          message.error("File size exceeded the 2MB limit.");
        } else {
          let name = dayjs(new Date()).unix();
          const newFileName = `${name}W.${ext}`;
          const myNewFile = new File([myFile], newFileName, {
            type: myFile.type,
          });
          const url = URL.createObjectURL(myNewFile);
          let obj = {
            file: myNewFile,
            url: url,
          };
          props?.onChange(obj);
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              {...getRootProps({
                className:
                  "bg-gray-100 border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-63 cursor-pointer",
              })}
            >
              <input {...getInputProps()} />
              <div>
                {props?.fileURL ? (
                  <Image
                    src={props?.fileURL}
                    width={0}
                    height={250}
                    className="w-full h-50 object-cover"
                    alt={"image"}
                  />
                ) : (
                  <div className="text-lg text-gray-300">
                    <MdOutlineCloudUpload size={50} />
                  </div>
                )}
              </div>
              <div>
                {props?.fileURL ? (
                  <div></div>
                ) : (
                  <div>
                    <div className="text-[12px] py-2 text-gray-500">
                      Drag and drop file here
                    </div>
                    <Button
                      ghost
                      type="primary"
                      size="small"
                      block
                      className="text-[12px]!"
                    >
                      Browse file
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default Upload;
