import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: "ap-south-1" });

export const sendToSQS = async (product) => {
  const command = new SendMessageCommand({
    QueueUrl: process.env.PRODUCT_QUEUE_URL,
    MessageBody: JSON.stringify(product),
  });

  await sqs.send(command);
};

