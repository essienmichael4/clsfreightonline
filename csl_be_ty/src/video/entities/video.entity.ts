import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Index, } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { VideoLike } from './video-like.entity';
import { VideoComment } from './video-comment.entity';

export enum Premiere {
  PRIVATE = 'Private',
  PUBLIC = 'Public',
  UNLISTED = 'Unlisted',
  SCHEDULED = 'Scheduled',
}

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string; // S3 object key

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  thumbnail?: string;

  @Column({ type: 'simple-json', nullable: true })
  tags?: string[];

  @Column({
    type: 'enum',
    enum: Premiere,
    default: Premiere.PUBLIC,
  })
  premiere: Premiere;

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

  @Column({ default: 0 })
  viewsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
