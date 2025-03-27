const { ElasticBeanstalkClient, DescribeApplicationVersionsCommand, UpdateEnvironmentCommand } = require("@aws-sdk/client-elastic-beanstalk");

const REGION = process.env.AWS_REGION || "us-east-1";
const APPLICATION_NAME = "shopping-react";
const EBS_ENV = process.env.EBS_ENV;  // Make sure this is set
const VERSION_LABEL = process.env.VERSION_LABEL;

const ebClient = new ElasticBeanstalkClient({ region: REGION });

async function checkVersionExists() {
  console.log("🔍 Checking if EB version exists:", VERSION_LABEL);

  const params = { ApplicationName: APPLICATION_NAME };
  const command = new DescribeApplicationVersionsCommand(params);

  try {
    const data = await ebClient.send(command);
    const versionExists = data.ApplicationVersions.some(v => v.VersionLabel === VERSION_LABEL);
    
    if (versionExists) {
      console.log("✅ Version exists:", VERSION_LABEL);
      return true;
    } else {
      console.log("⏳ Waiting for version to be available...");
      return false;
    }
  } catch (error) {
    console.error("❌ ERROR: Failed to check application version:", error);
    return false;
  }
}

async function deployVersion() {
  let retries = 5;
  while (retries > 0) {
    if (await checkVersionExists()) {
      break;
    }
    console.log(`⏳ Retrying in 10 seconds... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, 10000));
    retries--;
  }

  if (retries === 0) {
    console.error("❌ ERROR: Application version not found after waiting.");
    process.exit(1);
  }

  console.log(`🚀 Deploying EB version: ${VERSION_LABEL} to environment: ${EBS_ENV}`);
  const params = {
    EnvironmentName: EBS_ENV,
    VersionLabel: VERSION_LABEL,
  };

  try {
    const command = new UpdateEnvironmentCommand(params);
    await ebClient.send(command);
    console.log("✅ Successfully deployed new version!");
  } catch (error) {
    console.error("❌ Failed to deploy:", error);
    process.exit(1);
  }
}

deployVersion();
