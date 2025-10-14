import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateVideoDto } from './dto/requests.dto';
import { Video } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { VideoLike } from './entities/video-like.entity';
import { Client } from 'src/user/entities/client.entity';
import { VideoComment } from './entities/video-comment.entity';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video) private readonly videoRepo:Repository<Video>,
        @InjectRepository(VideoLike) private readonly videoLikeRepo:Repository<VideoLike>,
        @InjectRepository(VideoComment) private readonly commentRepo:Repository<VideoComment>,
        @InjectRepository(User) private readonly userRepo:Repository<User>,
        @InjectRepository(Client) private readonly clientRepo:Repository<Client>,
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

    async updateVideoMetadata(dto: UpdateVideoDto, userId: number) {
        try{
            const user = await this.userRepo.findOne({where: { id: userId }})
            const saveEntity = this.videoRepo.create({
                title : dto.title,
                description: dto.description ,
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

    async updateVideoMetadataWithThumbnail(dto: UpdateVideoDto, filename:string, userId: number) {
        try{
            const user = await this.userRepo.findOne({where: { id: userId }})
            const saveEntity = this.videoRepo.create({
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

    async findAll(query?: { search?: string; tag?: string }) {
        const { search, tag } = query || {};

        const qb = this.videoRepo.createQueryBuilder('video')
        .leftJoinAndSelect('video.comments', 'comments')
        .orderBy('video.createdAt', 'DESC');

        if (search) {
            qb.andWhere('video.title LIKE :search OR video.description LIKE :search', {
                search: `%${search}%`,
            });
        }

        if (tag) {
            qb.andWhere(':tag = ANY (string_to_array(video.tags, \',\'))', { tag });
        }

        return await qb.getMany();
    }

    async findOne(id: number) {
        return await this.videoRepo.findOne({
            where: { id },
            relations: ['comments'],
        });
    }
}
