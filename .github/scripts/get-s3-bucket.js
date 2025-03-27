const dotenv = require("dotenv");
const { ElasticBeanstalkClient, DescribeApplicationsCommand } = require("@aws-sdk/client-elastic-beanstalk");

dotenv.config();

const client = new ElasticBeanstalkClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

(async () => {
    try {
        const command = new DescribeApplicationsCommand({
            ApplicationNames: ["shopping-react"],
        });

        const response = await client.send(command);
        console.log("Elastic Beanstalk Application Details:", response);
    } catch (error) {
        console.error("Error fetching S3 bucket:", error);
    }
})();
