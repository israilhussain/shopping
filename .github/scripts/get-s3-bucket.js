import { writeFileSync } from "fs";
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

const client = new STSClient();
const command = new GetCallerIdentityCommand({});

(async () => {
  const { Account } = await client.send(command);
  const region = process.env.AWS_REGION;
  const S3_BUCKET = `elasticbeanstalk-${region}-${Account}`;

  console.log(`S3_BUCKET=${S3_BUCKET}`);
  writeFileSync(process.env.GITHUB_ENV, `S3_BUCKET=${S3_BUCKET}\n`, { flag: "a" });
})();
