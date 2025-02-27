import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
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

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
