import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn,} from 'typeorm';
import { Video } from './video.entity';
import { Client } from 'src/user/entities/client.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class VideoComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  // Comment made by a client (optional)
  @ManyToOne(() => Client, (client) => client.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  client?: Client;

  // Comment made by a user/admin (optional)
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user?: User;

  // The video being commented on
  @ManyToOne(() => Video, (video) => video.comments, { onDelete: 'CASCADE' })
  video: Video;

  // 🔁 Self-referencing relationship for replies
  @ManyToOne(() => VideoComment, (comment) => comment.replies, { nullable: true, onDelete: "CASCADE" })
  parent?: VideoComment;

  @OneToMany(() => VideoComment, (comment) => comment.parent, { cascade: true })
  replies?: VideoComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
