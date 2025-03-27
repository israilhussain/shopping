const { ElasticBeanstalkClient, CreateApplicationVersionCommand } = require("@aws-sdk/client-elastic-beanstalk");
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

const REGION = process.env.AWS_REGION || "us-east-1";  // Ensure AWS Region is set
const APPLICATION_NAME = "shopping-frontend";  // Update as per your app name
const VERSION_LABEL = process.env.VERSION_LABEL || `shopping-frontend-${Date.now()}`;
const S3_KEY = "Dockerrun.aws.json";  // Ensure this file exists in your S3 bucket

const ebClient = new ElasticBeanstalkClient({ region: REGION });
const s3Client = new S3Client({ region: REGION });

async function getS3BucketName() {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    const bucket = data.Buckets.find(bucket => bucket.Name.includes(APPLICATION_NAME));
    return bucket ? bucket.Name : null;
  } catch (error) {
    console.error("❌ ERROR: Failed to fetch S3 bucket name:", error);
    return null;
  }
}

async function createVersion() {
  const bucketName = await getS3BucketName();
  if (!bucketName) {
    console.error("❌ ERROR: No S3 bucket found. Check your AWS setup.");
    process.exit(1);
  }

  console.log(`📌 Creating EB version: ${VERSION_LABEL} with S3 Bucket: ${bucketName} and Key: ${S3_KEY}`);

  const params = {
    ApplicationName: APPLICATION_NAME,
    VersionLabel: VERSION_LABEL,
    SourceBundle: {
      S3Bucket: bucketName,
      S3Key: S3_KEY,
    },
  };

  try {
    const command = new CreateApplicationVersionCommand(params);
    await ebClient.send(command);
    console.log("✅ Successfully created application version:", VERSION_LABEL);
  } catch (error) {
    console.error("❌ Failed to create application version:", error);
    process.exit(1);
  }
}

createVersion();
