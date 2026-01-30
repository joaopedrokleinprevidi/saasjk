import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Lead } from '../leads/entities/lead.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async create(createTagDto: CreateTagDto, organizationId: string) {
    const { name } = createTagDto;

    const exists = await this.tagRepository.findOne({
      where: { organizationId, name },
    });

    if (exists) {
      throw new ConflictException(
        'Uma tag com este nome já existe nesta organização.',
      );
    }

    const tag = this.tagRepository.create({
      ...createTagDto,
      organizationId,
    });

    return this.tagRepository.save(tag);
  }

  findAll(organizationId: string) {
    return this.tagRepository.find({
      where: { organizationId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const tag = await this.tagRepository.findOne({
      where: { id, organizationId },
    });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto, organizationId: string) {
    const tag = await this.findOne(id, organizationId);

    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const exists = await this.tagRepository.findOne({
        where: { organizationId, name: updateTagDto.name },
      });

      if (exists) {
        throw new ConflictException(
          'Uma tag com este nome já existe nesta organização.',
        );
      }
    }

    await this.tagRepository.update({ id, organizationId }, updateTagDto);
    return this.findOne(id, organizationId);
  }

  async remove(id: string, organizationId: string) {
    const tag = await this.findOne(id, organizationId);
    return this.tagRepository.delete({ id, organizationId });
  }

  // Operações de Tags em Leads
  async assignTagsToLead(leadId: string, tagIds: string[], organizationId: string) {
    const lead = await this.leadRepository.findOne({
      where: { id: leadId, organizationId },
      relations: ['tags'],
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado.');
    }

    const tags = await this.tagRepository.find({
      where: { id: In(tagIds), organizationId },
    });

    if (tags.length !== tagIds.length) {
      throw new NotFoundException(
        'Uma ou mais tags não foram encontradas.',
      );
    }

    // Adiciona apenas tags que ainda não estão atribuídas
    const existingTagIds = lead.tags.map((tag) => tag.id);
    const newTags = tags.filter((tag) => !existingTagIds.includes(tag.id));
    
    lead.tags = [...lead.tags, ...newTags];
    
    await this.leadRepository.save(lead);
    
    return this.getLeadTags(leadId, organizationId);
  }

  async removeTagsFromLead(leadId: string, tagIds: string[], organizationId: string) {
    const lead = await this.leadRepository.findOne({
      where: { id: leadId, organizationId },
      relations: ['tags'],
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado.');
    }

    lead.tags = lead.tags.filter((tag) => !tagIds.includes(tag.id));
    
    await this.leadRepository.save(lead);
    
    return this.getLeadTags(leadId, organizationId);
  }

  async getLeadTags(leadId: string, organizationId: string) {
    const lead = await this.leadRepository.findOne({
      where: { id: leadId, organizationId },
      relations: ['tags'],
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado.');
    }

    return lead.tags;
  }
}
