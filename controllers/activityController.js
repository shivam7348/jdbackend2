import Activity from "../models/ActivityModel.js";
import { supabase } from "../utils/supabase.js";

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postActivity = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    // Generate unique file name
    const fileName = `jd-main/${Date.now()}-${req.file.originalname}`;

    // Upload image to Supabase Storage
    const { data, error } = await supabase.storage
      .from("jd-main") // Bucket name
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {
      console.error("Supabase upload error:", error);
      return res
        .status(500)
        .json({ error: "Supabase upload error", details: error.message });
    }

    // ✅ Correct way to get public URL
    const { data: publicUrlData } = supabase.storage
      .from("jd-main")
      .getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl || null;

    if (!publicUrl) {
      console.error("Public URL not found!");
      return res.status(500).json({ error: "Failed to retrieve public URL" });
    }

    // Save activity in MongoDB
    const newActivity = new Activity({
      title,
      description,
      image: {
        fileName: req.file.originalname,
        url: publicUrl, // Store public URL
      },
    });

    await newActivity.save();

    res.status(201).json({ message: "Activity saved", activity: newActivity });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // If a new image is uploaded, delete the old one and upload the new one
    let imageUrl = activity.image.url;
    if (req.file) {
      // Delete old image from Supabase
      const oldFileName = `jd-main/${activity.image.fileName}`;
      await supabase.storage.from("jd-main").remove([oldFileName]);

      // Upload new image
      const newFileName = `jd-main/${Date.now()}-${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from("jd-main")
        .upload(newFileName, req.file.buffer, { contentType: req.file.mimetype });

      if (error) {
        console.error("Supabase upload error:", error);
        return res.status(500).json({ error: "Image upload failed" });
      }

      // Get new public URL
      const { data: publicUrlData } = supabase.storage
        .from("jd-main")
        .getPublicUrl(newFileName);
      imageUrl = publicUrlData.publicUrl;

      activity.image = { fileName: req.file.originalname, url: imageUrl };
    }

    activity.title = title || activity.title;
    activity.description = description || activity.description;

    await activity.save();
    res.status(200).json({ message: "Activity updated", activity });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// Delete an activity
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Delete image from Supabase Storage
    const fileName = `jd-main/${activity.image.fileName}`;
    const { error } = await supabase.storage.from("jd-main").remove([fileName]);
    if (error) {
      console.error("Supabase delete error:", error);
    }

    await activity.deleteOne();
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}