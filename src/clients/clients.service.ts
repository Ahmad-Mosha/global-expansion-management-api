import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entity/clients.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async findByUserId(userId: string): Promise<Client | null> {
    return this.clientRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async create(
    userId: string,
    companyName: string,
    contactEmail: string,
  ): Promise<Client> {
    const client = this.clientRepository.create({
      user: { id: userId },
      company_name: companyName,
      contact_email: contactEmail,
    });
    return this.clientRepository.save(client);
  }
}
