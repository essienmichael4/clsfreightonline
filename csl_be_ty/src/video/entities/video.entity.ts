import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VideoLike } from "./video-like.entity";
import { VideoComment } from "./video-comment.entity";

export enum Premiere {
    PRIVATE = 'Private',
    PUBLIC = 'Public',
    UNLISTED = 'Unlisted',
    SCHEDULED = 'Scheduled',
}

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    key: string; // S3 object key

    @Column({ nullable: true })
    title?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'text', nullable: true })
    thumbnail?: string;

    @Column({ type: 'simple-array', nullable: true })
    tags?: string[];

    @Column({ default: 'Public' })
    premiere: 'Public' | 'Unlisted' | 'Private' | 'Scheduled';

    @Column({ default: false })
    isPublished: boolean;

    @ManyToOne(() => User, (user) => user.videos, { onDelete: 'CASCADE' })
    uploader: User;

    @OneToMany(() => VideoLike, (like) => like.video)
    likes: VideoLike[];

    @OneToMany(() => VideoComment, (comment) => comment.video)
    comments: VideoComment[];

    @Column({ default: 0 })
    likesCount: number;
}
