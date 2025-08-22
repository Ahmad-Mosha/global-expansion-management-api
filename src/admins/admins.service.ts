import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entity/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findByUserId(userId: string): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async create(userId: string): Promise<Admin> {
    const admin = this.adminRepository.create({
      user: { id: userId },
    });
    return this.adminRepository.save(admin);
  }
}
