import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createGroupDto: CreateGroupDto, organizationId: string) {
    const { name } = createGroupDto;

    const exists = await this.groupRepository.findOne({
      where: { organizationId, name },
    });

    if (exists) {
      throw new ConflictException(
        'Um grupo com este nome já existe nesta organização.',
      );
    }

    const group = this.groupRepository.create({
      ...createGroupDto,
      organizationId,
    });

    return this.groupRepository.save(group);
  }

  findAll(organizationId: string) {
    return this.groupRepository.find({
      where: { organizationId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const group = await this.groupRepository.findOne({
      where: { id, organizationId },
    });

    if (!group) {
      throw new NotFoundException('Grupo não encontrado.');
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, organizationId: string) {
    const group = await this.findOne(id, organizationId);

    if (updateGroupDto.name && updateGroupDto.name !== group.name) {
      const exists = await this.groupRepository.findOne({
        where: { organizationId, name: updateGroupDto.name },
      });

      if (exists) {
        throw new ConflictException(
          'Um grupo com este nome já existe nesta organização.',
        );
      }
    }

    await this.groupRepository.update({ id, organizationId }, updateGroupDto);
    return this.findOne(id, organizationId);
  }

  async remove(id: string, organizationId: string) {
    const group = await this.findOne(id, organizationId);
    return this.groupRepository.delete({ id, organizationId });
  }

  // Operações de Tag no Grupo
  async assignTagToGroup(groupId: string, tagId: string, organizationId: string) {
    const group = await this.findOne(groupId, organizationId);

    const tag = await this.tagRepository.findOne({
      where: { id: tagId, organizationId },
    });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }

    group.tagId = tagId;
    await this.groupRepository.save(group);

    return this.findOne(groupId, organizationId);
  }

  async removeTagFromGroup(groupId: string, organizationId: string) {
    const group = await this.findOne(groupId, organizationId);

    group.tagId = undefined;
    await this.groupRepository.save(group);

    return this.findOne(groupId, organizationId);
  }
}
