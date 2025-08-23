import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entity/user.entity';

@ApiTags('scheduler')
@Controller('scheduler')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('trigger-daily-refresh')
  @ApiOperation({
    summary: 'Manually trigger daily match refresh (Admin only)',
    description:
      'Triggers the daily match refresh job manually for testing purposes',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily refresh triggered successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async triggerDailyRefresh(): Promise<{ message: string }> {
    const result = await this.schedulerService.triggerDailyRefresh();
    return { message: result };
  }

  @Post('trigger-sla-check')
  @ApiOperation({
    summary: 'Manually trigger SLA compliance check (Admin only)',
    description:
      'Triggers the SLA compliance check job manually for testing purposes',
  })
  @ApiResponse({
    status: 200,
    description: 'SLA check triggered successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async triggerSlaCheck(): Promise<{ message: string }> {
    const result = await this.schedulerService.triggerSlaCheck();
    return { message: result };
  }
}
