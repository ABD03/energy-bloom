export const API = {
  BASE: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
  IMAGE_BASE: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
  // statics
  STATICS: "/statistics",
  //Embeded
  GET_EMBED: "admin/embed",
  //Page cache clear
  REVALIDATE: "admin/revalidate",
  //dashboard
  OVERVIEW: "admin/overview",
  OVERVIEW_CHART: "admin/overview/chart",
  OVERVIEW_TRENDING: "admin/overview/trending",
  //Users
  USERS: "admin/users",
  USERS_PICKER: "admin/users/picker",
  //images
  MEDIA: "admin/media",
  MEDIA_UPLOAD: "admin/media/upload",
  MEDIA_S3: "admin/media/s3upload",
  //Static pages
  PAGES: "admin/pages",
  PAGES_DETAILS: "admin/pages/details",
  //Contact
  CONTACT: "admin/contact",
  //Settings
  SETTINGS: "admin/settings",

  //------------WEBSITE APIS-----------------

  //AUTH APIS
  LOGIN: "auth",
  REGISTER: "auth/register",
  FORGOT_PASSWORD: "auth/forgot-password",
  LOGOUT: "auth/logout",
  UPDATE_PROFILE: "auth/update",
  CHANGE_PASSWORD: "auth/change-password",
  DELETE_ACCOUNT: "auth/delete",
  //USER
  GET_USER: "website/user",
  UPDATE_USER: "website/user",
  USER_STATS: "website/user/stats",
  //SETTINGS
  GET_SETTINGS: "website/settings",
  //MASTERDATA (categories + tags)
  GET_MASTERDATA: "website/masterdata",
  //CONTACT
  POST_CONTACT: "website/contact",
  //PAGES
  GET_PAGE_DETAILS: "website/pages/details",
};
