import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let storjClient: S3Client | null = null;

export function getStorjClient() {
  if (storjClient) return storjClient;

  const endpoint = process.env.STORJ_ENDPOINT;
  const accessKeyId = process.env.STORJ_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORJ_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.warn("Storj: configuraci?n incompleta para S3Client");
    return null;
  }

  storjClient = new S3Client({
    endpoint,
    region: "us-east-1",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  return storjClient;
}

export async function createUploadUrl(key: string, contentType: string, expiresInSeconds = 900) {
  const client = getStorjClient();
  const bucket = process.env.STORJ_BUCKET;
  if (!client || !bucket) {
    throw new Error("Storj client no inicializado correctamente");
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}
