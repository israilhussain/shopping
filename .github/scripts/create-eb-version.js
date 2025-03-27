import dotenv from "dotenv";
const { ElasticBeanstalkClient, CreateApplicationVersionCommand } = require("@aws-sdk/client-elastic-beanstalk");

dotenv.config();
const eb = new ElasticBeanstalkClient({ region: process.env.AWS_REGION });

(async () => {
  try {
    await eb.send(
      new CreateApplicationVersionCommand({
        ApplicationName: "shopping-react",
        VersionLabel: process.env.VERSION_LABEL,
        SourceBundle: {
          S3Bucket: process.env.S3_BUCKET,
          S3Key: `shopping-frontend-${process.env.VERSION_LABEL}.json`,
        },
      })
    );
    console.log("Created new EB version:", process.env.VERSION_LABEL);
  } catch (error) {
    console.error("Failed to create EB version:", error);
    process.exit(1);
  }
})();
