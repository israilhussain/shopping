const { ElasticBeanstalkClient, CreateApplicationVersionCommand } = require("@aws-sdk/client-elastic-beanstalk");
const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");

const region = process.env.AWS_REGION || "us-east-1";
const bucketName = process.env.S3_BUCKET_NAME; // Ensure this is set
const versionLabel = process.env.VERSION_LABEL;
const appName = "shopping-frontend"; // Change this if necessary
const key = `Dockerrun.aws.json`;

const ebClient = new ElasticBeanstalkClient({ region });
const s3Client = new S3Client({ region });

async function validateS3Object() {
    if (!bucketName) {
        console.error("❌ ERROR: No S3 bucket found. Check your AWS setup.");
        process.exit(1);
    }

    try {
        console.log(`🔍 Checking if ${key} exists in ${bucketName}...`);
        await s3Client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
        console.log(`✅ Found ${key} in ${bucketName}`);
    } catch (error) {
        console.error(`❌ ERROR: Dockerrun.aws.json not found in ${bucketName}`);
        process.exit(1);
    }
}

async function createEBVersion() {
    await validateS3Object(); // Ensure the file is there before proceeding

    try {
        console.log(`🚀 Creating new EB application version: ${versionLabel}`);
        const command = new CreateApplicationVersionCommand({
            ApplicationName: appName,
            VersionLabel: versionLabel,
            SourceBundle: {
                S3Bucket: bucketName,
                S3Key: key
            }
        });

        const response = await ebClient.send(command);
        console.log(`✅ Successfully created EB version: ${versionLabel}`);
        console.log(response);
    } catch (error) {
        console.error("❌ ERROR: Failed to create EB version:", error.message);
        process.exit(1);
    }
}

createEBVersion();
