import dotenv from "dotenv";
const { ElasticBeanstalkClient, CreateApplicationVersionCommand } = require("@aws-sdk/client-elastic-beanstalk");

dotenv.config();

const client = new ElasticBeanstalkClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const params = {
    ApplicationName: "shopping-react",
    EnvironmentName: process.env.EBS_ENV,
    VersionLabel: process.env.VERSION_LABEL,
    SourceBundle: {
        S3Bucket: process.env.S3_BUCKET_NAME,
        S3Key: `shopping-frontend/${process.env.VERSION_LABEL}.zip`,
    },
};

(async () => {
    try {
        const command = new CreateApplicationVersionCommand(params);
        const response = await client.send(command);
        console.log("Elastic Beanstalk application version created:", response);
    } catch (error) {
        console.error("Error creating EB version:", error);
    }
})();
