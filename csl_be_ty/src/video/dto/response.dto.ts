import { UserResponseDto } from "src/user/dto/user-response.dto";
import { Premiere } from "../entities/video.entity";

export class VideoResponseDto {
  id: number;
  title: string;
  key?: string;
  description?: string;
  thumbnail?: string;
  premiere?: Premiere;
  isPublished?: boolean;
  likesCount?: number;
  viewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  userLiked?: boolean;
  uploader?: UserResponseDto; // optional: nested user info

  constructor(partial: Partial<VideoResponseDto>) {
    Object.assign(this, partial);
  }
}
