import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Project, ProjectStatus } from '../projects/entity/project.entity';
import { Vendor } from '../vendors/entity/vendor.entity';
import { Match } from '../matches/entity/match.entity';
import { MatchesService } from '../matches/matches.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../users/entity/user.entity';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly scheduledJobsEnabled: boolean;

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private matchesService: MatchesService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {
    this.scheduledJobsEnabled = this.configService.get<boolean>(
      'ENABLE_SCHEDULED_JOBS',
      true,
    );
  }

  @Cron('0 2 * * *', { name: 'dailyMatchRefresh' }) // Daily at 2 AM
  async refreshMatchesDaily() {
    if (!this.scheduledJobsEnabled) {
      this.logger.log(
        'Scheduled jobs are disabled, skipping daily match refresh',
      );
      return;
    }

    this.logger.log('🔄 Starting daily match refresh for active projects...');

    try {
      // Get all active projects
      const activeProjects = await this.projectRepository.find({
        where: { status: ProjectStatus.ACTIVE },
        relations: ['client'],
      });

      let totalMatchesCreated = 0;

      for (const project of activeProjects) {
        try {
          this.logger.log(
            `Processing project ${project.id} in ${project.country}`,
          );

          // Rebuild matches for this project (as system/admin)
          const result = await this.matchesService.rebuildMatches(
            project.id,
            undefined, // No specific user
            UserRole.ADMIN, // Run as admin to bypass ownership checks
          );

          totalMatchesCreated += result.matchesCreated || 0;

          this.logger.log(
            `Created ${result.matchesCreated || 0} matches for project ${project.id}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to refresh matches for project ${project.id}:`,
            error,
          );
        }
      }

      this.logger.log(
        `✅ Daily match refresh completed. Processed ${activeProjects.length} projects, created ${totalMatchesCreated} matches`,
      );

      // Send notification to admins
      await this.notificationsService.sendDailyMatchRefreshNotification(
        activeProjects.length,
        totalMatchesCreated,
      );
    } catch (error) {
      this.logger.error('❌ Daily match refresh failed:', error);
    }
  }

  @Cron('0 */6 * * *', { name: 'slaCheck' }) // Every 6 hours
  async checkVendorSlas() {
    if (!this.scheduledJobsEnabled) {
      this.logger.log('Scheduled jobs are disabled, skipping SLA check');
      return;
    }

    this.logger.log('🔍 Starting vendor SLA compliance check...');

    try {
      // Get all vendors
      const vendors = await this.vendorRepository.find();
      const slaViolations = [];

      for (const vendor of vendors) {
        // Check if vendor has any recent matches that might indicate slow response
        const recentMatches = await this.matchRepository.find({
          where: { vendor_id: vendor.id },
          order: { created_at: 'DESC' },
          take: 5,
        });

        // Simple SLA check: if vendor has matches but low scores, flag as potential SLA issue
        if (recentMatches.length > 0) {
          const avgScore =
            recentMatches.reduce((sum, match) => sum + Number(match.score), 0) /
            recentMatches.length;

          // If average score is below 10 and vendor promises fast SLA, flag it
          if (avgScore < 10 && vendor.response_sla_hours <= 24) {
            slaViolations.push({
              vendor,
              avgScore,
              matchCount: recentMatches.length,
              issue: `Low performance score (${avgScore.toFixed(2)}) despite ${vendor.response_sla_hours}h SLA commitment`,
            });
          }
        }

        // Additional check: vendors with very high SLA promises (unrealistic)
        if (vendor.response_sla_hours > 168) {
          // More than 1 week
          slaViolations.push({
            vendor,
            avgScore: 0,
            matchCount: 0,
            issue: `Unrealistic SLA commitment of ${vendor.response_sla_hours} hours`,
          });
        }
      }

      // Send notifications for SLA violations
      for (const violation of slaViolations) {
        await this.notificationsService.sendSlaViolationNotification({
          adminEmails: ['effinbzz1@gmail.com', 'effinbzz3@gmail.com'],
          vendorName: violation.vendor.name,
          vendorId: violation.vendor.id,
          slaHours: violation.vendor.response_sla_hours,
          violationDetails: violation.issue,
        });
      }

      this.logger.log(
        `✅ SLA check completed. Found ${slaViolations.length} violations`,
      );
    } catch (error) {
      this.logger.error('❌ SLA check failed:', error);
    }
  }

  // Manual trigger methods for testing
  async triggerDailyRefresh(): Promise<string> {
    await this.refreshMatchesDaily();
    return 'Daily match refresh triggered manually';
  }

  async triggerSlaCheck(): Promise<string> {
    await this.checkVendorSlas();
    return 'SLA check triggered manually';
  }
}
