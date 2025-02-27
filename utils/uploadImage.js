import s3Client from "../config/awsConfig.js";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const MAX_SIZE = 2 * 1024 * 1024;

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
});

export const feedImageUpload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
}).any();

export const uploadImageToS3WithFolder = async (
  imageBuffer,
  folderName,
  fileName
) => {
  const normalizedFolderName = folderName.endsWith("/")
    ? folderName
    : `${folderName}/`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${normalizedFolderName}${fileName}`,
    Body: imageBuffer,
    ContentType: "image/jpeg/png/jpg",
    // ACL: 'public-read'
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    const key = `${fileName}`;
    const location = `https://s3.amazonaws.com/${params.Bucket}/${normalizedFolderName}${fileName}`;

    return { key, location };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
};
