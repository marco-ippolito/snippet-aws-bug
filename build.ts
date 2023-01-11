import { CredentialProvider } from "@aws-sdk/types";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";

const main = async (): Promise<void> => {
    await performCommands();
};

const performCommands = async (): Promise<void> => {
    await finalize("bucket-xyz-example");
};

export const awsCredentialProvider = (): CredentialProvider => {
    return fromNodeProviderChain();
};

export const finalize = async (
    bucket: string,
): Promise<void> => {
    const region = "eu-west-1";

    const credentials = awsCredentialProvider();

    const s3 = new S3({ credentials, region });

    while (true) {
        console.log("START");
        await pushToS3(
            s3,
            bucket,
            Buffer.from("", "utf-8"),
            "test/2",
        );
        console.log("DONE");
    }
};

const pushToS3 = async (s3: S3, bucket: string, data: Buffer, toFile: string): Promise<void> => {
    try {
        let contentType = "application/octet-stream";
        await s3.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: toFile,
                Body: data,
                CacheControl: undefined,
                ContentType: contentType ?? undefined,
            }),
        );
    } catch (e) {
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
