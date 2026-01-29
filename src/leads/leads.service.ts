import { ConflictException, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadSort } from './dto/find-all-leads.dto';

import { Lead } from './entities/lead.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder, Brackets } from 'typeorm';


@Injectable()
export class LeadsService {
  constructor(@InjectRepository(Lead) private readonly leadRepository: Repository<Lead>) {}

  async create(createLeadDto: CreateLeadDto, organizationId: string) {
    const { name, email, phone } = createLeadDto;
    
    const exists = await this.leadRepository.findOne({
      where: [
        { organizationId, phone },
        { organizationId, email },
        { organizationId, name },
      ],
    });

    const isFullyDuplicate =
      exists?.phone === phone &&
      exists?.email === email &&
      exists?.name === name;

    if (isFullyDuplicate) {
      throw new ConflictException(
        'Não é possível criar leads duplicados.',
      );
    }

    if (exists) {
        if (exists?.phone === phone) {
          throw new ConflictException('O número de telefone inserido já foi cadastrado anteriormente.');
        }

        if (exists?.email === email) {
          throw new ConflictException('O e-mail inserido já foi cadastrado anteriormente.');
        }

        if (exists?.name === name) {
          throw new ConflictException('O nome inserido já foi cadastrado anteriormente.');
        }

      throw new ConflictException('Verifique os dados inseridos. Não é possível criar leads com qualquer dado duplicado.');
    }

    const lead = this.leadRepository.create({
      ...createLeadDto,
      organizationId,
    });

    return this.leadRepository.save(lead);
  }

  findAll(organizationId: string, sort: LeadSort = 'recent') {
    const order: FindOptionsOrder<Lead> = sort === 'alphabetical' 
      ? { name: 'ASC' } 
      : sort === 'recent' ? { createdAt: 'DESC' } : { createdAt: 'ASC' };

    return this.leadRepository.find({ 
      where: { organizationId },
      order,
    });
  }

async findOneById(organizationId: string, id: string) {
  return this.leadRepository.findOne({
    where: { id, organizationId },
  });
}


  async findBySearch(
    organizationId: string,
    search?: string,
  ) {
    const normalizedSearch = search?.trim();

    if(!normalizedSearch) {
      return this.findAll(organizationId);
    }

    const qb = this.leadRepository
      .createQueryBuilder('lead')
      .where('lead.organizationId = :organizationId', { organizationId });

    qb.andWhere(
      new Brackets((qb) => {
        qb.where('lead.name ILIKE :search', { search: `${normalizedSearch}%` })
          .orWhere('lead.email ILIKE :search', { search: `${normalizedSearch}%` })
          .orWhere('lead.phone ILIKE :search', { search: `${normalizedSearch}%` });
      }),
    );

    return qb.getMany();
  }

  async update(id: string, updateLeadDto: UpdateLeadDto, organizationId: string) {
    await this.leadRepository.update({ id, organizationId }, updateLeadDto);
    return this.findOneById(organizationId, id);
  }

  remove(id: string, organizationId: string) {
    return this.leadRepository.delete({ id, organizationId });
  }
}
