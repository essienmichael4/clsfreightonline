import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import { Video } from './video.entity';
import { Client } from 'src/user/entities/client.entity';

@Entity()
@Unique(['client', 'video'])
export class VideoLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.likes, { onDelete: 'CASCADE' })
  client: Client;

  @ManyToOne(() => Video, (video) => video.likes, { onDelete: 'CASCADE' })
  video: Video;

  @CreateDateColumn()
  createdAt: Date;
}
