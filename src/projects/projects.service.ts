import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entity/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private clientsService: ClientsService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const client = await this.clientsService.findByUserId(userId);
    if (!client) {
      throw new ForbiddenException(
        `User with ID ${userId} is not associated with a client. Please ensure the user is registered as a client.`,
      );
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      client_id: userId, // Use userId directly as client_id
    });
    return this.projectRepository.save(project);
  }

  async findAllByClient(userId: string): Promise<Project[]> {
    const client = await this.clientsService.findByUserId(userId);
    if (!client) {
      throw new ForbiddenException('User is not associated with a client');
    }

    return this.projectRepository.find({
      where: { client_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const client = await this.clientsService.findByUserId(userId);
    if (!client) {
      throw new ForbiddenException('User is not associated with a client');
    }

    const project = await this.projectRepository.findOne({
      where: { id, client_id: userId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(id, userId);

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectRepository.remove(project);
  }
}
