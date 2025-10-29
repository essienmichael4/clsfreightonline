import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { Request, Response } from 'express';

@Injectable()
export class UploadService {
    constructor(private readonly fileService:FileService){}

    async addAttachment(imageBuffer: Buffer, filename:string){
        return await this.fileService.uploadAsset(imageBuffer, filename)
    }

    async addThumbnail(imageBuffer: Buffer, filename:string){
        return await this.fileService.uploadThumbnail(imageBuffer, filename)
    }

    async addVideo(imageBuffer: Buffer, filename:string){
        return await this.fileService.uploadVideo(imageBuffer, filename)
    }
    
    async deleteAttachment(filename:string){
        return await this.fileService.deleteAsset(filename)
    }
    
    async deleteThumbnail(filename:string){
        return await this.fileService.deleteThumbnail(filename)
    }
    
    async deleteVideo(filename:string){
        return await this.fileService.deleteVideo(filename)
    }

    async getSignedUrl(filename:string){
        return await this.fileService.getPresignedUrl(filename)
    }

    async getThumbnailSignedUrl(filename:string){
        return await this.fileService.getThumbnailPresignedUrl(filename)
    }

    async getVideoSignedUrl(filename:string, contentType: string){
        return await this.fileService.getVideoPresigned(filename, contentType)
    }

    async startMultipartUpload(filename:string, contentType: string){
        return await this.fileService.startMultipartUpload(filename, contentType)
    }

    async getMultipartPartPresignedUrl(key: string, uploadId: string, partNumber: number){
        return this.fileService.getMultipartPresigned(key, uploadId, partNumber)
    }

    async completeMultipartUpload(key: string, uploadId: string, parts: { ETag: string, PartNumber: number }[]){
        return this.fileService.completeMultipartUpload(key, uploadId, parts)
    }

    async streamVideoFromS3(key: string, req: Request, res: Response){
        return this.fileService.streamVideoFromS3(key, req, res)
    }
}
