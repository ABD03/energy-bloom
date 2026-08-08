"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import PickerModal from "../filePicker/pickerModal";
import GalleryModal from "../filePicker/galleryModal";

import { GET } from "@/utils/apiCalls";
import { API } from "@/config/apis";
import { ViewImage } from "@/utils/viewImage";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((m) => m.Editor),
  { ssr: false },
);

declare global {
  interface Window {
    twttr?: any;
  }
}

export default function TextEditor(props: any) {
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState<any>();
  const [libraryModal, setLibraryModal] = useState<any>();

  const addImage = (image: any) => {
    editorRef.current.insertContent(`
      <img 
        src="${ViewImage(image?.name)}" 
        alt="${image?.name}" 
        style="width:100%; height:300px; object-fit:cover; display:block;" 
      />
  `);
  };

  let toolbar =
    "fullscreen  \
    bold italic underline link unlink embededbtn blocks  forecolor backcolor \
    removeformat  gallary upload code bullist numlist";

  let plugins =
    "advlist autolink lists link code preview charmap preview anchor searchreplace visualblocks code insertdatetime table wordcount pageembed code preview code autoresize pageembed media image fullscreen quickbars";

  let quickbars_insert_toolbar = "customPaste gallary upload embededbtn";

  let quickbars_selection_toolbar =
    "bold italic underline link h1 h2 h3 forecolor removeformat";

  let script_extended = "script[src|async|defer|type|charset]";
  let iframe_extended =
    "iframe[src|width|height|frameborder|allow|allowfullscreen|sandbox|scrolling|style]";

  async function fetchEmbedHtml(url: any) {
    try {
      let URL = `${API.GET_EMBED}?link=${url}`;
      let response: any = await GET(URL, null);
      if (response?.status) {
        return response?.data;
      } else {
        return "null";
      }
    } catch (err) {
      console.log("err = = = >", err);
      return "null";
    }
  }

  const editorBox = () => {
    return (
      <Editor
        onInit={(_evt: any, editor: any) => {
          editorRef.current = editor;
          setLoading(false);
        }}
        value={props?.value}
        init={{
          tinymceScriptSrc: "/_editor/tinymce.min.js",
          promotion: false,
          extended_valid_elements: `${script_extended},${iframe_extended},style`,
          valid_elements: "*[*]",
          valid_children: "+body[iframe]",
          plugins: plugins,
          toolbar: toolbar,
          min_height: 500,
          theme: "silver",
          directionality: "ltr",
          toolbar_mode: "sliding",
          menubar: true,
          cleanup: false,
          convert_urls: false,
          media_live_embeds: true,
          resize_img_proportional: false,
          sandbox_iframes: false,
          convert_unsafe_embeds: false,
          quickbars_insert_toolbar: quickbars_insert_toolbar,
          quickbars_selection_toolbar: quickbars_selection_toolbar,
          quickbars_image_toolbar: "image link deleteImage ",
          mobile: {
            theme: "silver",
            toolbar: toolbar,
            plugins: plugins,
            menubar: true,
            cleanup: false,
            convert_urls: false,
            media_live_embeds: true,
            resize_img_proportional: false,
            sandbox_iframes: false,
            convert_unsafe_embeds: false,
            contextmenu: false,
            quickbars_insert_toolbar: quickbars_insert_toolbar,
            quickbars_image_toolbar: "image link deleteImage",
          },
          setup: (editor: any) => {
            editor.ui.registry.addButton("upload", {
              text: null,
              icon: "upload",
              toolbar: "Upload image",
              onAction: () => setUploadModal(true),
            });
            editor.ui.registry.addButton("gallary", {
              text: null,
              icon: "gallery",
              tooltip: "Select image from gallery",
              onAction: () => setLibraryModal(true),
            });
            editor.ui.registry.addButton("customPaste", {
              text: "Paste",
              icon: "paste",
              tooltip: "Paste Content",
              onAction: () => {
                navigator.clipboard.readText().then((clipText) => {
                  editor.insertContent(
                    `<p>${clipText
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")}</p>`,
                  );
                });
              },
            });
            editor.ui.registry.addButton("deleteImage", {
              text: "Delete",
              icon: "remove",
              tooltip: "Delete Image",
              onAction: () => {
                const node = editor.selection.getNode();
                if (node.nodeName === "IMG") {
                  node.remove();
                }
              },
            });
            editor.ui.registry.addButton("embededbtn", {
              text: "Embed",
              icon: "blockquote",
              tooltip: "Embed social media",
              onAction: () => {
                editor.windowManager.open({
                  title: "Embed URL",
                  icon: "",
                  body: {
                    type: "panel",
                    items: [
                      {
                        type: "input",
                        name: "EmbedURL",
                        label: "Enter URL",
                        inputMode: "url",
                      },
                    ],
                  },
                  buttons: [
                    { type: "cancel", text: "Close" },
                    { type: "submit", text: "Insert", primary: true },
                  ],
                  onSubmit: async (api: any) => {
                    try {
                      editor.setProgressState(true);
                      const data = api.getData();
                      const url = data.EmbedURL;
                      const embedHtml = await fetchEmbedHtml(url);
                      editor.insertContent(embedHtml + "<p><br></p>");
                      api.close();
                    } catch (err) {
                      console.error("Failed to fetch embed:", err);
                      editor.windowManager.alert(
                        "Could not fetch tweet embed.",
                      );
                    } finally {
                      editor.setProgressState(false);
                    }
                  },
                });
              },
            });
          },
          file_browser_callback_types: "image media",
          file_picker_callback: function (
            callback: any,
            value: any,
            meta: any,
          ) {
            console.log("meta = = = >", meta);
          },
          paste_data_images: false,
        }}
        onEditorChange={(Content: any, Editor: any) => props?.onChange(Content)}
        // onChange={(Content: any, Editor: any) => {
        //   console.log("Content = = = >", Content);
        //   console.log("Editor = = = >", Editor);
        // }}
      />
    );
  };

  return (
    <div>
      {loading && <div>Loading</div>}
      {editorBox()}
      {uploadModal ? (
        <PickerModal
          data={{}}
          visible={uploadModal}
          onchange={(value: any) => addImage(value)}
          onCancel={() => setUploadModal(false)}
        />
      ) : null}
      {libraryModal ? (
        <GalleryModal
          data={{}}
          visible={libraryModal}
          onchange={(value: any) => addImage(value)}
          onCancel={() => setLibraryModal(false)}
        />
      ) : null}
    </div>
  );
}
