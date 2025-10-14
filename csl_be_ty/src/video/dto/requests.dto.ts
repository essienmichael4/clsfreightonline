import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";

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
    @IsArray()
    tags?: string[];

    @IsOptional()
    @IsEnum(['Public', 'Unlisted', 'Private', 'Scheduled'])
    premiere?: 'Public' | 'Unlisted' | 'Private' | 'Scheduled';
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
