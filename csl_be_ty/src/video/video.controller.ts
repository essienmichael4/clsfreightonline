import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 } from 'uuid';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { UpdateVideoDto, VideoRequestDto } from './dto/requests.dto';
import { UploadService } from 'src/upload/upload.service';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request, Response } from 'express';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

const MAX_IMAGE_SIZE_IN_BYTE = 2 * 1024 * 1024

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService, private readonly uploadService:UploadService) {}

  @UseGuards(JwtGuard)
  @Post("comment/client")
  async addComment(@Param('id', ParseIntPipe) id: number, @Body('content') content: string, @User() user:UserInfo) {    
    return this.videoService.addComment(id, content, { clientId: user.sub.id});
  }

  @UseGuards(JwtGuard)
  @Post("comment/admin")
  async addAdminComment(@Param('id', ParseIntPipe) id: number, @Body('content') content: string, @User() user:UserInfo) {
    return this.videoService.addComment(id, content, { userId: user.sub.id });
  }

  @Get('comments/:id')
  async getComments(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.getComments(id);
  }

  @UseGuards(JwtGuard)
  @Post('meta-thumbnail')
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: ImageFileFilter
    })
  )
  public async uploadFile(@Body() dto: UpdateVideoDto, @Req() req:any, @User() user:UserInfo,
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
      .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file: Express.Multer.File){
    try{
      if(!file || req.fileValidationError){
        throw new BadRequestException("Only .jpg, .jpeg, .png files are allowed")
      }
      
      const buffer = file.buffer
      const filename = `${v4()}-${file.originalname.replace(/\s+/g,'_')}`
      
      await this.uploadService.addThumbnail(buffer, filename) 
      
      return this.videoService.updateVideoMetadataWithThumbnail(dto, filename, user.sub.id) 
    }catch(err){
      throw err
    }
  }

  @Post('presigned-url')
  async getPresignedUrl(@Body() body: { filename: string; contentType: string }) {
    return await this.uploadService.getVideoSignedUrl(body.filename, body.contentType) 
  }

  @Post('start')
  async startMultipartUpload(@Body() body: { filename: string; contentType: string }) {
    return await this.uploadService.startMultipartUpload(body.filename, body.contentType)
  }

  @Get('presign-part')
  async getPresignedPartUrl(@Query('key') key: string, @Query('uploadId') uploadId: string, @Query('partNumber') partNumber: string,) {
    return await this.uploadService.getMultipartPartPresignedUrl(key, uploadId, Number(partNumber))
  }

  @Post('complete')
  async completeMultipartUpload(@Body() body: { key: string; uploadId: string; parts: { ETag: string; PartNumber: number }[] }, ) {
    return await this.uploadService.completeMultipartUpload(body.key, body.uploadId, body.parts)
  }

  @UseGuards(JwtGuard)
  @Patch(':id/like')
  async toggleLike(@Param('id', ParseIntPipe) id: number, @User() user:UserInfo) {
    return this.videoService.toggleLike(id, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Patch(":id/video-meta")
  async updateVideo(@Body() updateVideoDto: UpdateVideoDto, @User() user:UserInfo) {
    return this.videoService.updateVideoMetadata(updateVideoDto, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/edit')
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: ImageFileFilter
    })
  )
  public async updateVideoFile(@Body() dto: UpdateVideoDto, @Req() req:any, @User() user:UserInfo,
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
      .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file: Express.Multer.File){
    try{
      if(!file || req.fileValidationError){
        throw new BadRequestException("Only .jpg, .jpeg, .png files are allowed")
      }
      
      const buffer = file.buffer
      const filename = `${v4()}-${file.originalname.replace(/\s+/g,'_')}`
      
      await this.uploadService.addThumbnail(buffer, filename) 
      
      return this.videoService.updateVideoMetadataWithThumbnail(dto, filename, user.sub.id) 
    }catch(err){
      throw err
    }
  }

  @Get('stream/:key')
  async streamVideo(@Param('key') key: string, @Req() req: Request, @Res() res: Response) {
     return this.uploadService.streamVideoFromS3(key, req, res);
  }

  @Get()
  async findAll(@Query() pageOptionsDto:PageOptionsDto, @Query('search') search?: string, @Query('tag') tag?: string,
  ) {
    return this.videoService.findAll(pageOptionsDto, { search, tag });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Delete(":id")
  async deleteVideo(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.deleteVideo(id);
  }
}
