"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalize = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessKeyId = process.env.ACCESS_KEY || "";
const secretAccessKey = process.env.SECRET_ACCESS_KEY || "";
const region = "us-east-1";
const bucketName = "node-bug-bucket";
const main = async () => {
    await performCommands();
};
const performCommands = async () => {
    await (0, exports.finalize)(bucketName);
};
const finalize = async (bucket) => {
    const credentials = {
        accessKeyId,
        secretAccessKey,
    };
    const s3 = new client_s3_1.S3({ credentials, region });
    let counter = 0;
    while (true) {
        counter++;
        console.log("START");
        await pushToS3(s3, bucket, Buffer.from("", "utf-8"), "test/2");
        console.log(`DONE: ${counter}`);
    }
};
exports.finalize = finalize;
const pushToS3 = async (s3, bucket, data, toFile) => {
    try {
        let contentType = "application/octet-stream";
        await s3.send(new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: toFile,
            Body: data,
            CacheControl: undefined,
            ContentType: contentType ?? undefined,
        }));
    }
    catch (e) {
        console.log(e);
    }
};
main()
    .then(() => {
    console.log("Build done");
})
    .catch((e) => {
    console.error(e);
});
