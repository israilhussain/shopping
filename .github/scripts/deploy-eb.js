import { ElasticBeanstalkClient, UpdateEnvironmentCommand } from "@aws-sdk/client-elastic-beanstalk";
import dotenv from "dotenv";

dotenv.config();
const eb = new ElasticBeanstalkClient({ region: process.env.AWS_REGION });

(async () => {
  try {
    await eb.send(
      new UpdateEnvironmentCommand({
        ApplicationName: "shopping-react",
        EnvironmentName: process.env.EBS_ENV,
        VersionLabel: process.env.VERSION_LABEL,
      })
    );
    console.log("Deployed new EB version:", process.env.VERSION_LABEL);
  } catch (error) {
    console.error("Deployment Failed:", error);
    process.exit(1);
  }
})();
