import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    image: {
      fileName: {
        type: String,
        required: [true, "Image filename is required"],
      },
      url: {
        type: String,
        required: [true, "Image URL is required"],
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
