import { signRequest, s3UnsignedPayloadHash } from "./aws-signing";
import { request } from "https";
import dotenv from "dotenv";

dotenv.config();

const accessKeyId = process.env.ACCESS_KEY || "";
const secretAccessKey = process.env.SECRET_ACCESS_KEY || "";
const region = "us-east-1";
const bucketName = "node-bug-bucket";
const url = `https://${bucketName}.s3.${region}.amazonaws.com`;
const method = "PUT";

const headers = signRequest(
  accessKeyId,
  secretAccessKey,
  "s3",
  region,
  url,
  method,
  {
    "content-type": "application/octet-stream",
    "content-length": "0",
    expect: "100-continue",
    host: `${bucketName}.s3.${region}.amazonaws.com`,
    "x-amz-content-sha256": s3UnsignedPayloadHash,
  },
  Buffer.from("", "utf-8")
);

const options = {
  host: url,
  method: "PUT",
  body: Buffer.from("", "utf-8"),
  headers,
};
let counter = 0;
export async function main() {
  while (true) {
    counter++;
    console.log("START");
    await sendToS3();
    console.log(`DONE: ${counter}`);
  }
}

function sendToS3() {
  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      if (res.statusCode != 200) {
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }

      const body: any = [];
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        resolve(Buffer.concat(body).toString());
      });
    });
    req.on("error", (e) => {
      reject(e.message);
    });
    req.end();
  });
}

main()
  .then(() => {
    console.log("Build done");
  })
  .catch((e) => {
    console.error(e);
  });

process.on("exit", () => {
  debugger;
});

process.on("unhandledRejection", () => {
  debugger;
});

process.on("uncaughtException", () => {
  debugger;
});

process.on("error", () => {
  debugger;
});

process.on("beforeExit", (whatever) => {
  debugger;
});
