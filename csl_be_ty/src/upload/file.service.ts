import { DeleteObjectCommand, PutObjectCommand, S3Client, GetObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, CompleteMultipartUploadCommandOutput, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from 'uuid';
import { Request, Response } from 'express';

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
            Key: `videos/${filename}`
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
        if (!range) {
            throw new NotFoundException('Range header required');
        }

        // Get metadata about the video (like file size and type)
        const head = await this.s3Client.send(
            new HeadObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: key,
            }),
        );

        const fileSize = head.ContentLength!;
        const contentType = head.ContentType || 'video/mp4';

        // Parse the range header
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        // Set headers for partial content
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType,
        });

        // Stream video chunk directly from S3
        const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Range: `bytes=${start}-${end}`,
        });

        const data = await this.s3Client.send(getObjectCommand);
        const stream = data.Body as NodeJS.ReadableStream;

        stream.pipe(res);
    }
}
