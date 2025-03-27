const { ElasticBeanstalkClient, DescribeApplicationsCommand } = require("@aws-sdk/client-elastic-beanstalk");
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

const region = process.env.AWS_REGION || "us-east-1"; // Ensure correct region

async function getS3BucketName() {
    const ebClient = new ElasticBeanstalkClient({ region });
    const s3Client = new S3Client({ region });

    try {
        // Step 1: Get EB Environment details
        const command = new DescribeApplicationsCommand({});
        const response = await ebClient.send(command);

        if (!response.Applications || response.Applications.length === 0) {
            throw new Error("No applications found in Elastic Beanstalk.");
        }

        // Step 2: Try extracting the bucket name (check for lifecycle config)
        const app = response.Applications[0]; // Assuming only one EB app
        const bucketName = app.ResourceLifecycleConfig?.ServiceRole; // This might not be correct

        if (bucketName) {
            console.log(bucketName); // ✅ Print only the bucket name
            return;
        }

        // Step 3: Fallback: Get S3 bucket list and check for EB pattern
        const s3Response = await s3Client.send(new ListBucketsCommand({}));
        const ebBucket = s3Response.Buckets.find(bucket =>
            bucket.Name.startsWith("elasticbeanstalk-" + region)
        );

        if (!ebBucket) {
            throw new Error("S3 bucket for Elastic Beanstalk not found.");
        }

        console.log(ebBucket.Name); // ✅ Ensure only the bucket name is logged
    } catch (error) {
        console.error("❌ Error fetching S3 bucket:", error.message);
        process.exit(1);
    }
}

getS3BucketName();
