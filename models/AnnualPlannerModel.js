import mongoose from "mongoose";

const annualPlannerSchema = new mongoose.Schema(
  {
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
  { timestamps: true } // This enables createdAt and updatedAt fields
);

const AnnualPlanner = mongoose.model("AnnualPlanner", annualPlannerSchema);
export default AnnualPlanner;
