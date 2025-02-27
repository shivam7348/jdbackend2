import Gallery from "../models/GalleryModel.js";
import { supabase } from "../utils/supabase.js";

export const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const galleryUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const fileName = `jd-main/${Date.now()}-${req.file.originalname}`;

    // Upload image to Supabase Storage
    const { data, error } = await supabase.storage
      .from("jd-main")
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {
      console.error("Supabase upload error:", error);
      return res
        .status(500)
        .json({ error: "Supabase upload error", details: error.message });
    }

    // Get public URL of uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("jd-main")
      .getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl || null;

    if (!publicUrl) {
      return res.status(500).json({ error: "Failed to retrieve public URL" });
    }

    // Save image details in MongoDB
    const newImage = new Gallery({
      image: {
        fileName: req.file.originalname,
        url: publicUrl,
      },
    });

    await newImage.save();

    res
      .status(201)
      .json({ message: "Image uploaded successfully", image: newImage });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { fileName } = req.body; // Assuming only fileName needs to be updated

    const updatedImage = await Gallery.findByIdAndUpdate(
      req.params.id,
      { "image.fileName": fileName },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    res
      .status(200)
      .json({ message: "Image updated successfully", image: updatedImage });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete image
export const deleteGallery = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Extract the file path from the public URL
    const filePath = image.image.url.split("/storage/v1/object/public/")[1];

    // Delete from Supabase storage
    const { error } = await supabase.storage.from("jd-main").remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete image from storage" });
    }

    // Delete from MongoDB
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
