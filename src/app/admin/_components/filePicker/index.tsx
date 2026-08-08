"use client";

import { useState } from "react";
import { Button, Flex } from "antd";
import Image from "next/image";
import { IoCloseCircleOutline } from "react-icons/io5";
import { SlCloudUpload } from "react-icons/sl";
import { TfiGallery } from "react-icons/tfi";

import PickerModal from "./pickerModal";
import GalleryModal from "./galleryModal";
import { ImageLoader } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

const FilePicker = (props: any) => {
  const [uploadModal, setUploadModal] = useState<any>();
  const [libraryModal, setLibraryModal] = useState<any>();
  return (
    <div className="border border-dashed border-gray-300 bg-white rounded-xl p-2! flex flex-col gap-2.5 overflow-hidden">
      <div className="flex gap-3">
        <div>
          <Image
            src={ViewImage(props?.url)}
            alt={"Loading"}
            height={0}
            width={0}
            objectFit="cover"
            loader={ImageLoader}
            className="h-22 w-22 object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex">
            <div className="flex-1">
              <div className="text-gray-900 font-medium text-[13px] mb-1">
                {props?.url ? props?.url : "Select Image"}
              </div>
            </div>
            {props?.url ? (
              <div onClick={() => props.onchange(null)}>
                <IoCloseCircleOutline size={20} color="red" />
              </div>
            ) : null}
          </div>
          <div className="text-xs line-clamp-3 overflow-hidden text-ellipsis mb-2.5 text-gray-400">
            <div>
             Pick a image form gallery or upload
            </div>
          </div>
          <Flex gap={10} className="mb-1!">
            <Button
              block
              onClick={() => setUploadModal(true)}
              size="small"
              className="text-[12px]! bg-slate-50!"
            >
              <SlCloudUpload className="text-primary" /> Upload
            </Button>
            {props?.show_gallery === false ? null : (
              <Button
                block
                onClick={() => setLibraryModal(true)}
                size="small"
                className="text-[12px]! bg-slate-50!"
              >
                <TfiGallery className="text-primary" /> Gallery
              </Button>
            )}
          </Flex>
        </div>
      </div>
      {uploadModal ? (
        <PickerModal
          data={{}}
          visible={uploadModal}
          onchange={(value: any) => props.onchange(value)}
          onCancel={() => setUploadModal(false)}
        />
      ) : null}
      {libraryModal ? (
        <GalleryModal
          data={{}}
          visible={libraryModal}
          onchange={(value: any) => props.onchange(value)}
          onCancel={() => setLibraryModal(false)}
        />
      ) : null}
    </div>
  );
};

export default FilePicker;
