const fs = require("fs");
const dotenv = require("dotenv");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

dotenv.config();

const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const filePath = "./Dockerrun.aws.json";
const fileContent = fs.readFileSync(filePath);

const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `shopping-frontend/${process.env.VERSION_LABEL}.zip`,
    Body: fileContent,
};

(async () => {
    try {
        const command = new PutObjectCommand(params);
        await client.send(command);
        console.log("File uploaded to S3 successfully.");
    } catch (error) {
        console.error("Error uploading file to S3:", error);
    }
})();
