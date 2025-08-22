import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entity/project.entity';

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Client user ID' })
  client_id: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  services_needed: string[];

  @ApiProperty()
  budget: number;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
