import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TopVendorsResponseDto } from './dto/top-vendors-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entity/user.entity';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({
    summary: 'Get top 3 vendors per country with document counts',
    description:
      'Returns top 3 vendors per country based on average match score from last 30 days (MySQL) and count of research documents linked to expansion projects in that country (MongoDB)',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics data retrieved successfully',
    type: TopVendorsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getTopVendors(): Promise<TopVendorsResponseDto> {
    return this.analyticsService.getTopVendors();
  }
}
