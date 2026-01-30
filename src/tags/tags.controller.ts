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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AssignTagsDto } from './dto/assign-tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    const organizationId = 'dev';
    return this.tagsService.create(createTagDto, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    const organizationId = 'dev';
    return this.tagsService.findAll(organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const organizationId = 'dev';
    return this.tagsService.findOne(id, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const organizationId = 'dev';
    return this.tagsService.update(id, updateTagDto, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    const organizationId = 'dev';
    return this.tagsService.remove(id, organizationId);
  }

  // Operações de Tags em Leads
  @HttpCode(HttpStatus.OK)
  @Post('leads/:leadId/assign')
  assignTagsToLead(
    @Param('leadId') leadId: string,
    @Body() assignTagsDto: AssignTagsDto,
  ) {
    const organizationId = 'dev';
    return this.tagsService.assignTagsToLead(
      leadId,
      assignTagsDto.tagIds,
      organizationId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('leads/:leadId/remove')
  removeTagsFromLead(
    @Param('leadId') leadId: string,
    @Body() assignTagsDto: AssignTagsDto,
  ) {
    const organizationId = 'dev';
    return this.tagsService.removeTagsFromLead(
      leadId,
      assignTagsDto.tagIds,
      organizationId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('leads/:leadId')
  getLeadTags(@Param('leadId') leadId: string) {
    const organizationId = 'dev';
    return this.tagsService.getLeadTags(leadId, organizationId);
  }
}
