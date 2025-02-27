import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  text: String,
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
