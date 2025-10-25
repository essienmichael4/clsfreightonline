import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateVideoDto } from './dto/requests.dto';
import { Video } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { VideoLike } from './entities/video-like.entity';
import { Client } from 'src/user/entities/client.entity';
import { VideoComment } from './entities/video-comment.entity';
import { VideoResponseDto } from './dto/response.dto';
import { UploadService } from 'src/upload/upload.service';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video) private readonly videoRepo:Repository<Video>,
        @InjectRepository(VideoLike) private readonly videoLikeRepo:Repository<VideoLike>,
        @InjectRepository(VideoComment) private readonly commentRepo:Repository<VideoComment>,
        @InjectRepository(User) private readonly userRepo:Repository<User>,
        @InjectRepository(Client) private readonly clientRepo:Repository<Client>,
        private readonly uploadService: UploadService,
        
    ){}

    async addComment(videoId: number, content: string, author: { userId?: number; clientId?: number },) {
        const video = await this.videoRepo.findOne({ where: { id: videoId } });
        if (!video) throw new NotFoundException('Video not found');

        const comment = this.commentRepo.create({ content, video });

        // Attach either user or client
        if (author.userId) {
            const user = await this.userRepo.findOne({ where: { id: author.userId } });
            if (!user) throw new NotFoundException('User not found');
            comment.user = user;
        } else if (author.clientId) {
            const client = await this.clientRepo.findOne({ where: { id: author.clientId } });
            if (!client) throw new NotFoundException('Client not found');
            comment.client = client;
        } else {
            throw new NotFoundException('No valid author found');
        }

        return await this.commentRepo.save(comment);
    }

    async getComments(videoId: number) {
        return this.commentRepo.find({
            where: { video: { id: videoId } },
            relations: ['user', 'client'],
            order: { createdAt: 'DESC' },
        });
    }
    

    async toggleLike(videoId: number, userId: number) {
        const video = await this.videoRepo.findOne({ where: { id: videoId } });
        if (!video) throw new NotFoundException('Video not found');

        const client = await this.clientRepo.findOne({ where: { id: userId } });
        if (!client) throw new NotFoundException('Client not found');

        const existing = await this.videoLikeRepo.findOne({
            where: { video: { id: videoId }, client: { id: userId } },
        });

        if (existing) {
            // Unlike
            await this.videoLikeRepo.remove(existing);
            await this.videoRepo.decrement({ id: videoId }, 'likesCount', 1);
            return { message: 'Unliked video', liked: false };
        } else {
            // Like
            const like = this.videoLikeRepo.create({ video, client });
            await this.videoLikeRepo.save(like);
            await this.videoRepo.increment({ id: videoId }, 'likesCount', 1);
            return { message: 'Liked video', liked: true };
        }
    }

    async updateVideoMetadata(videoId: number, dto: UpdateVideoDto, userId: number) {
        try {
            const result = await this.videoRepo.findOne({
            where: { id: videoId },
            relations: { uploader: true },
            });

            if (!result) {
            throw new NotFoundException("Video not found");
            }

            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) {
            throw new NotFoundException("User not found");
            }

            // Merge the updated fields into the existing video
            result.title = dto.title ?? result.title;
            result.description = dto.description ?? result.description;
            result.tags = dto.tags ?? result.tags;
            result.premiere = dto.premiere ?? result.premiere;
            result.isPublished = true;
            result.uploader = user;

            await this.videoRepo.save(result);

            return { message: "Video metadata updated successfully" };
        } catch (err) {
            throw err;
        }
    }


    async addVideoMetadataWithThumbnail(dto: UpdateVideoDto, filename:string, userId: number) {
        try{
            const user = await this.userRepo.findOne({where: { id: userId }})
            const saveEntity = this.videoRepo.create({
                key: dto.key,
                title : dto.title,
                description: dto.description ,
                thumbnail: filename,
                tags: dto.tags,
                premiere: dto.premiere,
                isPublished: true,
                uploader: user
            })
    
            await this.videoRepo.save(saveEntity);
    
            return { message: 'Video metadata updated successfully'};
        }catch(err){
            throw err
        }
    }

    async updateVideoMetadataWithThumbnail( videoId: number, dto: UpdateVideoDto, filename: string, buffer: Buffer<ArrayBufferLike>, userId: number ) {
        try {
            const video = await this.videoRepo.findOne({
                where: { id: videoId },
                relations: { uploader: true },
            });

            if (!video) {
                throw new NotFoundException('Video not found');
            }

            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Only delete old thumbnail if one exists and it's different
            if (video.thumbnail && video.thumbnail !== filename) {
                await this.uploadService.deleteThumbnail(video.thumbnail);
            }

            // Upload new thumbnail
            await this.uploadService.addThumbnail(buffer, filename);

            // Update fields
            video.title = dto.title ?? video.title;
            video.description = dto.description ?? video.description;
            video.tags = dto.tags ?? video.tags;
            video.premiere = dto.premiere ?? video.premiere;
            video.thumbnail = filename;
            video.uploader = user;

            await this.videoRepo.save(video);

            return { message: 'Video metadata updated successfully' };
        } catch (err) {
            // Optionally log or wrap error
            throw err;
        }
    }


    async findAll(pageOptionsDto: PageOptionsDto, query?: { search?: string; tag?: string }) {
        const { search, tag } = query || {};

        const qb = this.videoRepo.createQueryBuilder('video')
        .leftJoinAndSelect('video.uploader', 'uploader')
        .orderBy('video.createdAt', 'DESC')
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take);

        // qb.andWhere(
        //     '(LOWER(video.title) LIKE LOWER(:search) OR LOWER(video.description) LIKE LOWER(:search))',
        //     { search: `%${search}%` },
        // );

        // if (tag) {
        //     qb.andWhere('FIND_IN_SET(:tag, video.tags)', { tag });
        // }

        const [videos, total] = await qb.getManyAndCount();

        const response = videos.map(
            (video) => new VideoResponseDto(video),
        );

        const videosResponse = await Promise.all(
            response.map(async (video) => {
                video.thumbnail = video.thumbnail
                    ? await this.uploadService.getThumbnailSignedUrl(video.thumbnail)
                    : null;
                return video;
            })
        )

        const pageMetaDto = new PageMetaDto({
              itemCount: total,
              pageOptionsDto,
            });
        
        return new PageDto(videosResponse, pageMetaDto);
    }

    async findVideoDetails(id: number) {
        // Fetch video and related uploader
        const result = await this.videoRepo.findOne({
            where: { id },
            relations: { uploader: true },
        });

        if (!result) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }

        // Generate signed thumbnail URL if available
        if (result.thumbnail) {
            result.thumbnail = await this.uploadService.getThumbnailSignedUrl(result.thumbnail);
        }

        return new VideoResponseDto(result);
    }

    async findOne(id: string) {
        const result = await this.videoRepo.findOne({
            where: { key: `videos/${id}` },
            relations: {comments: true, uploader: true},
        });

        const response = new VideoResponseDto(result)
        return response
    }

    async deleteVideo(id: number) {
        // 1️⃣ Find video in DB
        const video = await this.videoRepo.findOne({ where: { id } });
        if (!video) {
            throw new NotFoundException("Video does not exist");
        }

        try {
            // 2️⃣ Delete from S3
            await this.uploadService.deleteVideo(video.key);

            // 3️⃣ Delete thumbnail if it exists
            if (video.thumbnail) {
                await this.uploadService.deleteThumbnail(video.thumbnail);
            }
        } catch (err) {
            console.error("S3 delete error:", err);
            throw new InternalServerErrorException("Failed to delete video from S3");
        }

        // 4️⃣ Delete record from DB
        await this.videoRepo.delete(id);

        return { message: "Video deleted successfully", id };
    }
}
