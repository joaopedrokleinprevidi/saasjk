import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignTagsDto {
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  tagIds: string[];
}
