import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDocumentDto {
  @ApiProperty({ example: 'uuid-project-id', required: false })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({ example: 'market research', required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    example: 'market,research',
    required: false,
    description: 'Comma-separated tags (e.g., "market,research,analysis")',
  })
  @IsOptional()
  @IsString()
  tags?: string;
}
