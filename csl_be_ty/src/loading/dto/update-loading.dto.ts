import { PartialType } from '@nestjs/mapped-types';
import { CreateLoadingDto } from './create-loading.dto';

export class UpdateLoadingDto extends PartialType(CreateLoadingDto) {}
