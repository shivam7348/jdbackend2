import axios from "axios";
import { uploadImageToS3WithFolder } from "./uploadImage.js";

export const downloadImage = async (imageUrl, folderName, fileName) => {
  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    const imageBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      response.data.on("data", (chunk) => {
        chunks.push(chunk);
      });
      response.data.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      response.data.on("error", (error) => {
        reject(new Error("Error downloading image: " + error.message));
      });
    });

    const uploadResult = await uploadImageToS3WithFolder(
      imageBuffer,
      folderName,
      fileName
    );

    return {
      fileName: uploadResult.key,
      fileUrl: uploadResult.location,
    };
  } catch (error) {
    console.error("Error downloading and uploading image:", error.message);
    throw new Error("Failed to download and upload image");
  }
};
