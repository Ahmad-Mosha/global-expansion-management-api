import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entity/user.entity';

@ApiTags('matches')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post(':id/matches/rebuild')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Rebuild vendor matches for a project' })
  @ApiResponse({
    status: 200,
    description: 'Matches rebuilt successfully',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async rebuildMatches(@Param('id') projectId: string) {
    return this.matchesService.rebuildMatches(projectId);
  }
}
