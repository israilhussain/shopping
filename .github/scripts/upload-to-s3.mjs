import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const s3 = new S3Client({ region: process.env.AWS_REGION });

const fileName = `shopping-frontend-${process.env.VERSION_LABEL}.json`;
const fileContent = fs.readFileSync("Dockerrun.aws.json");

(async () => {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: fileContent,
        ACL: "private",
      })
    );
    console.log("Uploaded to S3:", fileName);
  } catch (error) {
    console.error("S3 Upload Failed:", error);
    process.exit(1);
  }
})();
