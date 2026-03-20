import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsEnum, IsDateString, IsOptional, IsArray,  IsNotEmpty, ArrayMinSize, IsNumber, IsString } from 'class-validator';
import { Status } from '../entities/package.entity';
import { Type } from 'class-transformer';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {}

export class PackageStatusRequest {
  @IsEnum(Status)
  status: Status;

  @IsDateString()
  @IsOptional()
  loaded: string;

  @IsDateString()
  @IsOptional()
  loadedDate: string;

  @IsDateString()
  @IsOptional()
  received: string;

  @IsOptional()
  @IsDateString()
  eta?: string
}

export class UpdatePackagesStatusDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsNumber({}, { each: true })
  ids: number[];

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsOptional()
  @IsDateString()
  loaded?: string;

  @IsOptional()
  @IsDateString()
  eta?: string;

  @IsOptional()
  @IsString()
  vessel?: string;  // added
}
