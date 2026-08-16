import {S3Client, PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import sharp from "sharp";
import {nanoid} from "nanoid";

const client = new S3Client({
    accessKeyId: process.env.SESSION_ACCESS_KEY_ID,
    secretAccessKey: process.env.SESSION_SECRET_KEY,
    region: process.env.SESSION_REGION,
    apiVersion: process.env.SESSION_VERSION,
});

const resizeImage = async (buffer) => {
    return sharp(buffer).resize(1600, 900, {fit: 'inside', withoutEnlargement: true}).toBuffer();
}

const uploadToS3 = async (buffer, ContentType, uploadedBy) => {
    const fileExtension = await sharp(buffer).metadata().format || 'jpg';
    const Key = `${nanoid()}.${fileExtension}`;
    const Location = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        Body: buffer,
        ContentType,
    }
    try {
        await client.send(new PutObjectCommand(params));
        return {Key, Location, uploadedBy};
    } catch (error) {
        console.log(error)
        throw new Error("Upload to S3 failed")
    }
}

export const uploadImageToS3 = async (files, uploadedBy) => {
    const uploadPromises = files.map(async (file) => {
        return uploadToS3(await resizeImage(file.buffer), file.mimetype, uploadedBy)
    })
    return Promise.all(uploadPromises);
}

export const deleteImageFromS3 = async (Key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
    };
    try {
        await client.send(new DeleteObjectCommand(params));
    } catch (error) {
        console.log(error)
        throw new Error("Upload to S3 failed")
    }
}