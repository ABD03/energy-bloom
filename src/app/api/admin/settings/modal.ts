import mongoose from "mongoose";
const { Schema } = mongoose;

const languageSchema = new Schema(
  {
    code: { type: String, default: "en" },
    label: { type: String, default: "English" },
    locale: { type: String, default: "en-US" },
    og_locale: { type: String, default: "en_US" },
  },
  { timestamps: true, _id: false },
);

const ContactSchema = new Schema(
  {
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    address: { type: String },
    google: { type: String },
    whatsapp: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    telegram: { type: String },
    reddit: { type: String },
    threads: { type: String },
    pinterest: { type: String },
  },
  { _id: false },
);

const DefaultEditorSchema = new Schema(
  {
    name: { type: String },
    image: { type: String },
    bio: { type: String },
    disclaimer: { type: String },
  },
  { _id: false },
);

const MetaDataSchema = new Schema(
  {
    meta_title: { type: String },
    meta_description: { type: String },
    meta_keywords: [{ type: String }],
    meta_image: { type: String },
    shortcut: { type: String },
    apple: { type: String },
    meta_creator: { type: String },
  },
  { _id: false },
);

const SchemaOrgSchema = new Schema(
  {
    alt_name: { type: String },
    knowsAbout: { type: String },
  },
  { _id: false },
);

const AppSchema = new Schema(
  {
    name: { type: String },
    tagline: { type: String },
    category: { type: String },
    language: languageSchema,
    meta_alt_language: [languageSchema],
    favicon: { type: String },
    logo_light: { type: String },
    logo_dark: { type: String },
    ads_txt: { type: String },
    robots_txt: { type: String },
    manifest_json: { type: String },
    google_verification: { type: String },
  },
  { _id: false },
);

const ScriptItemSchema = new Schema(
  {
    name: { type: String },
    position: { type: String, enum: ["head", "body", "footer"] },
    strategy: {
      type: String,
      enum: ["beforeInteractive", "afterInteractive", "lazyOnload"],
      default: "afterInteractive",
    },
    content: { type: String },
  },
  { _id: false },
);

const SettingsSchema = new Schema(
  {
    contact: { type: ContactSchema, default: () => ({}) },
    default_editor: { type: DefaultEditorSchema, default: () => ({}) },
    meta_data: { type: MetaDataSchema, default: () => ({}) },
    schema: { type: SchemaOrgSchema, default: () => ({}) },
    app: { type: AppSchema, default: () => ({}) },
    scripts: { type: [ScriptItemSchema], default: [] },
  },
  { timestamps: true },
);

const Settings =
  mongoose.models.settings || mongoose.model("settings", SettingsSchema);
export default Settings;
