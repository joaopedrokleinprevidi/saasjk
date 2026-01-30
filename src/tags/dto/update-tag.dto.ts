import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color code (e.g., #3B82F6)',
  })
  color?: string;
}
