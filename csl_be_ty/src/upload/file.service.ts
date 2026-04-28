import { DeleteObjectCommand, PutObjectCommand, S3Client, GetObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, CompleteMultipartUploadCommandOutput, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from 'uuid';
import { Request, Response } from 'express';

const DEFAULT_CHUNK_SIZE = 1 * 1024 * 1024; // 1MB

@Injectable()
export class FileService {
    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
        credentials: {
            accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
        }
    })

    constructor(private readonly configService: ConfigService){}
    
    async getPresignedUrl(filename:string){
        const getObjectParams = {
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `assets/${filename}`
        }
        const command = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(this.s3Client, command, {expiresIn: 3600})
        return url
    }
    
    async getThumbnailPresignedUrl(filename:string){
        const getObjectParams = {
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `thumbnails/${filename}`
        }
        const command = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(this.s3Client, command, {expiresIn: 3600})
        return url
    }
    
    async getProductPresignedUrl(filename:string){
        const getObjectParams = {
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `tests/${filename}`
        }
        const command = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(this.s3Client, command, {expiresIn: 3600})
        return url
    }

    async getVideoPresigned(filename:string, contentType: string){
        const key = `videos/${v4()}-${filename.replace(/\s+/g, '_')}`
        const command = new PutObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 5 });

        return {
            uploadUrl: url,
            key: key,
            bucket: this.configService.getOrThrow('BUCKET_NAME'),
        };
    }

    // async getSignedUrlCloudfront(filename:string){
    //     const date = new Date(Date.now() + 1000 * 60 * 60 * 24)
    //     const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY
        // const buff = Buffer.from(privateKey).toString('base64');
        // console.log(buff);
        
    //     const key = Buffer.from(privateKey , 'base64').toString('ascii')
    //     return getSignedUrl({
    //         url: `https://dh0ursehl95lm.cloudfront.net/${filename}`,
    //         dateLessThan: String(date),
    //         keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    //         privateKey: key,
    //     })
    // }

    async uploadAsset(imageBuffer: Buffer, filename:string){
        return await this.s3Client.send(
            new PutObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Body: imageBuffer,
            Key: `assets/${filename}`
        }))
    }

    async deleteAsset(filename:string){
        return await this.s3Client.send(
            new DeleteObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `assets/${filename}`
        }))
    }

    async deleteThumbnail(filename:string){
        return await this.s3Client.send(
            new DeleteObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `thumbnails/${filename}`
        }))
    }

    async deleteVideo(filename:string){
        return await this.s3Client.send(
            new DeleteObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: filename
        }))
    }

    async uploadVideo(imageBuffer: Buffer, filename:string){
        return await this.s3Client.send(
            new PutObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Body: imageBuffer,
            Key: `videos/${filename}`
        }))
    }

    async uploadThumbnail(imageBuffer: Buffer, filename:string){
        return await this.s3Client.send(
            new PutObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Body: imageBuffer,
            Key: `thumbnails/${filename}`
        }))
    }

    async uploadProduct(imageBuffer: Buffer, filename:string){
        return await this.s3Client.send(
            new PutObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Body: imageBuffer,
            Key: `tests/${filename}`
        }))
    }

    async startMultipartUpload(filename:string, contentType: string){
        const key = `videos/${v4()}-${filename.replace(/\s+/g, '_')}`

        const command = new CreateMultipartUploadCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: key,
            ContentType: contentType,
        });

        const response = await this.s3Client.send(command)

        return {
            uploadId: response.UploadId,
            key: response.Key,
        };
    }

    async getMultipartPresigned(key:string, uploadId: string, partNumber: number){
        const command = new UploadPartCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber
        });

        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

        return {
            uploadUrl: url
        };
    }

    async completeMultipartUpload(key: string, uploadId: string, parts: { ETag: string, PartNumber: number }[]) {
        const command = new CompleteMultipartUploadCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts,
            },
        });

        const result: CompleteMultipartUploadCommandOutput = await this.s3Client.send(command);
        return result;
    }

    async streamVideoFromS3(key: string, req: Request, res: Response) {
        const range = req.headers.range;

        const head = await this.s3Client.send(
            new HeadObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `videos/${key}`,
            }),
        );

        const fileSize = head.ContentLength!;
        const contentType =
            head.ContentType?.includes('video') ? head.ContentType : 'video/mp4';

        let start = 0;
        let end = fileSize - 1;

        // 🔹 If Range exists → respect it
        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            start = Number(parts[0]);
            end = parts[1] ? Number(parts[1]) : Math.min(start + DEFAULT_CHUNK_SIZE - 1, fileSize - 1);
        } else {
            // 🔹 No Range → send ONLY first chunk
            end = Math.min(DEFAULT_CHUNK_SIZE - 1, fileSize - 1);
        }

        if (start >= fileSize) {
            res.status(416).end();
            return;
        }

        const chunkSize = end - start + 1;

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Range',
            'Access-Control-Expose-Headers': 'Content-Range, Content-Length',
        });

        const data = await this.s3Client.send(
            new GetObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `videos/${key}`,
            Range: `bytes=${start}-${end}`,
            }),
        );

        (data.Body as NodeJS.ReadableStream).pipe(res);
    }

}
