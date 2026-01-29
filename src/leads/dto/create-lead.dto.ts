import { IsEmail, IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

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