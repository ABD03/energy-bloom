"use client";
import { API } from "@/config/apis";
import { message } from "antd";
import { handleUnauthorized } from "../app/api/_helpers/authHandler";
const BASE = `${API.BASE}/api/`;
const GET = async (url: any, params: any) => {
  return new Promise(async (resolve, reject) => {
    fetch(BASE + url, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 401) {
          handleUnauthorized();
        }
        return response.json();
      })
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const POST = async (url: any, body: any) => {
  return new Promise(async (resolve, reject) => {
    fetch(BASE + url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const PUT = async (url: any, body: any) => {
  return new Promise(async (resolve, reject) => {
    fetch(BASE + url, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const DELETE = async (url: any) => {
  return new Promise(async (resolve, reject) => {
    fetch(BASE + url, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const UPLOAD_FILE = async (file: any, compress: boolean = true) => {
  return new Promise(async (resolve, reject) => {
    message.loading({
      content: "Uploading File",
      duration: 2,
    });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("compress", String(compress));
    fetch(`${API.IMAGE_BASE}/api/${API.MEDIA_UPLOAD}`, {
      method: "post",
      credentials: "include",
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// const S3_UPLOAD = async (file: any) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const S3 = {
//         bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
//         dirName: process.env.NEXT_PUBLIC_S3_FOLDER,
//         region: process.env.NEXT_PUBLIC_S3_BUCKET_REGION,
//         accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
//         secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
//       };
//       if (file && file.name) {
//         message.loading({
//           content: "Uploading File",
//           duration: 2,
//         });
//         const response = await S3FileUpload.uploadFile(file, S3);
//         if (response) {
//           resolve({ ...response, name: file.name });
//         } else {
//           reject("faild");
//         }
//       } else {
//         resolve(null);
//       }
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

export { GET, POST, PUT, DELETE, UPLOAD_FILE };
