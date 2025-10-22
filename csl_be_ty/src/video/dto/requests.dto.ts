import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { Premiere } from "../entities/video.entity";
import { Transform } from "class-transformer";

export class VideoRequestDto{
    @IsString()
    @IsOptional()
    filename?:string
}

export class UpdateVideoDto {
    @IsString()
    key: string; // S3 object key or unique video identifier

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
            return JSON.parse(value);
            } catch {
            return [];
            }
        }
        return value;
    })
    @IsArray()
    tags?: string[];

    @IsOptional()
    @IsEnum(Premiere)
    premiere?: Premiere;
}

// export class UpdateVideoThumbnailDto {
//   @IsString()
//   key: string;

//   @IsOptional()
//   @IsString()
//   title?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsArray()
//   tags?: string[];

//   @IsOptional()
//   @IsString()
//    premiere?: string;
// }
