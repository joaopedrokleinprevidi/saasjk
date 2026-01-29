import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;
}
