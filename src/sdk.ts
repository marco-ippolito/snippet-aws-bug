import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const accessKeyId = process.env.ACCESS_KEY || "";
const secretAccessKey = process.env.SECRET_ACCESS_KEY || "";
const region = "us-east-1";
const bucketName = "node-bug-bucket";

const main = async (): Promise<void> => {
  const s3 = new S3({ credentials: { accessKeyId, secretAccessKey }, region });
  let counter = 0;
  while (true) {
    counter++
    console.log("START");
    await pushToS3(s3, bucketName, Buffer.from("", "utf-8"), "test/2");
    console.log(`DONE: ${counter}`);
  }
};

async function pushToS3(s3: S3, bucket: string, data: Buffer, toFile: string) {
  try {
    let contentType = "application/octet-stream";
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: toFile,
        Body: data,
        CacheControl: undefined,
        ContentType: contentType ?? undefined,
      })
    );
  } catch (e) {
    console.log(e);
  }
}

main()
  .then(() => {
    console.log("Build done");
  })
  .catch((e) => {
    console.error(e);
  });
