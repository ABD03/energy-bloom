import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
  label: { type: String, required: true },
  value: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
});

const tagSchema = new Schema({
  label: { type: String, required: true },
  value: {
    type: Schema.Types.ObjectId,
    ref: "tags",
    required: true,
  },
});

const liveSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: false },
  },
  { timestamps: true },
);

const languageSchema = new Schema(
  {
    code: { type: String, default: "en" },
    label: { type: String, default: "English" },
    locale: { type: String, default: "en-US" },
    og_locale: { type: String, default: "en_US" },
  },
  { timestamps: true, _id: false },
);

const PRIORITY_2_LIMIT = 10;

const contentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: [categorySchema],
    tags: [tagSchema],
    live: [liveSchema],
    position: { type: Number, default: 1 },
    image: { type: String },
    video: { type: String },
    content: { type: String },
    permalink: { type: String, required: true, unique: true },
    meta_title: { type: String, required: false },
    meta_description: { type: String, required: false },
    meta_image: {
      type: String,
      required: false,
      default: "/default/placeholder.png",
    },
    author: { type: String, required: true },
    reading_time: { type: String, required: false },
    is_video: { type: Boolean, default: false },
    is_live: { type: Boolean, default: false },
    is_premium: { type: Boolean, default: false },
    priority: {
      type: String,
      default: "0",
      enum: ["0", "1", "2"],
    },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "published", "trashed"],
    },
    editor: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    language: languageSchema,
    views: { type: Number, default: 0 },
    notification_count: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

async function checkAndManagePriority2(model: any) {
  const priority2Count = await model.countDocuments({ priority: "2" });
  if (priority2Count >= PRIORITY_2_LIMIT) {
    const oldestPriority2 = await model
      .findOne({ priority: "2" })
      .sort({ updatedAt: 1 });
    if (oldestPriority2) {
      await model.findByIdAndUpdate(oldestPriority2._id, { priority: "0" });
    }
  }
}

const normalizeLabel = (val: string) => val?.trim().replace(/\s+/g, " ") || "";

contentSchema.pre("save", async function () {
  try {
    if (this.category?.length) {
      this.category.forEach((c: any) => {
        c.label = normalizeLabel(c.label);
      });
    }
    if (this.tags?.length) {
      this.tags.forEach((t: any) => {
        t.label = normalizeLabel(t.label);
      });
    }
  } catch (e) {}

  try {
    const model = mongoose.model("content");

    if (this.isModified("priority")) {
      if (this.priority === "1") {
        const existingPriorityOne = await model.findOne({
          priority: "1",
          _id: { $ne: this._id },
        });

        if (existingPriorityOne) {
          await checkAndManagePriority2(model);
          await model.findByIdAndUpdate(existingPriorityOne._id, {
            priority: "2",
          });
        }
      } else if (this.priority === "2") {
        await checkAndManagePriority2(model);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

contentSchema.pre("findOneAndUpdate", async function () {
  try {
    const update = this.getUpdate() as any;
    if (update?.category?.length) {
      update.category.forEach((c: any) => {
        c.label = normalizeLabel(c.label);
      });
    }
    if (update?.tags?.length) {
      update.tags.forEach((t: any) => {
        t.label = normalizeLabel(t.label);
      });
    }
  } catch (e) {}

  try {
    const model = mongoose.model("content");
    const update = this.getUpdate() as any;
    const query = this.getQuery();

    if (update && update.priority) {
      if (update.priority === "1") {
        const existingPriorityOne = await model.findOne({
          priority: "1",
          _id: { $ne: query._id },
        });

        if (existingPriorityOne) {
          await checkAndManagePriority2(model);
          await model.findByIdAndUpdate(existingPriorityOne._id, {
            priority: "2",
          });
        }
      } else if (update.priority === "2") {
        await checkAndManagePriority2(model);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

contentSchema.statics.getPriority2Count = async function () {
  return await this.countDocuments({ priority: "2" });
};

contentSchema.statics.getRemainingPriority2Slots = async function () {
  const currentCount = await this.countDocuments({ priority: "2" });
  return Math.max(0, PRIORITY_2_LIMIT - currentCount);
};

const Content =
  mongoose.models.content || mongoose.model("content", contentSchema);

export default Content;
