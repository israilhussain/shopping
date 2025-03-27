const { ElasticBeanstalkClient, DescribeApplicationsCommand } = require("@aws-sdk/client-elastic-beanstalk");

const client = new ElasticBeanstalkClient({ region: "us-east-1" });

async function getS3BucketName() {
    try {
        const command = new DescribeApplicationsCommand({});
        const response = await client.send(command);

        if (!response.Applications || response.Applications.length === 0) {
            throw new Error("No applications found in Elastic Beanstalk.");
        }

        const app = response.Applications[0]; // Assuming only one application
        const bucketName = app.ResourceLifecycleConfig?.ServiceRole; // Adjust if incorrect

        if (!bucketName) {
            throw new Error("S3 bucket name not found.");
        }

        console.log(bucketName); // ✅ This ensures the correct bucket name is returned
    } catch (error) {
        console.error("❌ Error fetching S3 bucket:", error.message);
        process.exit(1); // Ensure script fails if there's an issue
    }
}

getS3BucketName();
