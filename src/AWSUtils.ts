import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
    region: process.env.REACT_APP_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY || '',
      secretAccessKey: process.env.REACT_APP_SECRET_KEY || '',
    },
});

export const PutObject = async (filename:string, body:any) => {
    // Define the parameters for the `putObject` operation
    const bucketName = process.env.REACT_APP_BUCKET_NAME;
    const objectKey = filename; // The key (path) for the object in the bucket
    const fileContent = body; // Content of the object you want to upload

    // Create a new PutObjectCommand
    const putObjectParams = {
        Bucket: bucketName,
        Key: `uploads/${objectKey}`,
        Body: fileContent,
        ACL: "public-read"
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(putObjectParams));
            console.log("Successfully uploaded object:", data);
      } catch (error) {
            console.error("Error uploading object:", error);
      }
}