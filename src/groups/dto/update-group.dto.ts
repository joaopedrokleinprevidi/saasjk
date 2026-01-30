import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
