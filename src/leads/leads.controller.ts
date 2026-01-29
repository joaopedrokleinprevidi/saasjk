import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { FindAllLeadsDto } from './dto/find-all-leads.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createLeadDto: CreateLeadDto) {
    const organizationId = "dev"
    return this.leadsService.create(createLeadDto, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
  @Query() query: FindAllLeadsDto,
) {
    const organizationId = "dev";
    return this.leadsService.findAll(organizationId, query.sort);
  }

  @HttpCode(HttpStatus.OK)
  @Get('search')
  findBySearch(@Query('search') search?: string) {
    const organizationId = "dev";
    return this.leadsService.findBySearch(organizationId, search);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOneById(@Param('id') id: string) {
    const organizationId = "dev";
    return this.leadsService.findOneById(organizationId, id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    const organizationId = "dev";
    return this.leadsService.update(id, updateLeadDto, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    const organizationId = "dev";
    return this.leadsService.remove(id, organizationId);
  }
}
