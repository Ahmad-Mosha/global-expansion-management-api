import { ApiProperty } from '@nestjs/swagger';

export class MatchResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'Vendor ID' })
  vendorId: string;

  @ApiProperty({ example: 8.5, description: 'Match score' })
  score: number;
}

export class RebuildMatchesResponseDto {
  @ApiProperty({ example: 'Matches rebuilt successfully' })
  message: string;

  @ApiProperty({ example: 'uuid-string', description: 'Project ID' })
  projectId: string;

  @ApiProperty({ example: 5, description: 'Number of matches found' })
  matchesFound: number;

  @ApiProperty({ type: [MatchResponseDto], description: 'List of matches' })
  matches: MatchResponseDto[];
}
