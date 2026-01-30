import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    const organizationId = 'dev';
    return this.groupsService.create(createGroupDto, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    const organizationId = 'dev';
    return this.groupsService.findAll(organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const organizationId = 'dev';
    return this.groupsService.findOne(id, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    const organizationId = 'dev';
    return this.groupsService.update(id, updateGroupDto, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    const organizationId = 'dev';
    return this.groupsService.remove(id, organizationId);
  }

  // Operações de Tag no Grupo
  @HttpCode(HttpStatus.OK)
  @Post(':id/assign-tag/:tagId')
  assignTagToGroup(
    @Param('id') groupId: string,
    @Param('tagId') tagId: string,
  ) {
    const organizationId = 'dev';
    return this.groupsService.assignTagToGroup(groupId, tagId, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/remove-tag')
  removeTagFromGroup(@Param('id') groupId: string) {
    const organizationId = 'dev';
    return this.groupsService.removeTagFromGroup(groupId, organizationId);
  }
}
