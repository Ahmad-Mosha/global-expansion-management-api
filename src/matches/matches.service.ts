import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entity/match.entity';
import { Project } from '../projects/entity/project.entity';
import { Vendor } from '../vendors/entity/vendor.entity';
import { UserRole } from '../users/entity/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    private notificationsService: NotificationsService,
  ) {}

  async rebuildMatches(
    projectId: string,
    userId?: string,
    userRole?: UserRole,
  ) {
    // Get project details
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check authorization - clients can only rebuild matches for their own projects
    if (userRole === UserRole.CLIENT && project.client_id !== userId) {
      throw new ForbiddenException(
        'You can only rebuild matches for your own projects',
      );
    }

    // Find eligible vendors using MySQL queries
    const eligibleVendors = await this.findEligibleVendors(project);

    // Calculate scores and prepare matches
    const matchData = eligibleVendors
      .map((vendor) => {
        const score = this.calculateScore(project, vendor);
        return {
          project_id: projectId,
          vendor_id: vendor.id,
          score,
        };
      })
      .filter(
        (match) =>
          // Filter out any invalid matches
          match.project_id &&
          match.vendor_id &&
          !isNaN(match.score) &&
          isFinite(match.score),
      );

    // Get existing matches to compare
    const existingMatches = await this.matchRepository.find({
      where: { project_id: projectId },
    });

    // Idempotent upsert - delete existing matches first, then insert new ones
    await this.matchRepository.delete({ project_id: projectId });

    let newMatches: Match[] = [];
    if (matchData.length > 0) {
      newMatches = await this.matchRepository.save(matchData);
    }

    // Send notifications for new matches (only if this is not a scheduled job)
    if (userRole !== UserRole.ADMIN || userId) {
      await this.sendMatchNotifications(project, newMatches, existingMatches);
    }

    return {
      message: 'Matches rebuilt successfully',
      projectId,
      matchesFound: matchData.length,
      matchesCreated: newMatches.length,
      matches: matchData.map((match) => ({
        vendorId: match.vendor_id,
        score: match.score,
      })),
    };
  }

  private async findEligibleVendors(project: Project): Promise<Vendor[]> {
    // Find vendors that cover the same country and have at least one service overlap
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .where('JSON_CONTAINS(vendor.countries_supported, :country)', {
        country: JSON.stringify(project.country),
      })
      .andWhere('JSON_OVERLAPS(vendor.services_offered, :services)', {
        services: JSON.stringify(project.services_needed),
      })
      .getMany();
  }

  private calculateScore(project: Project, vendor: Vendor): number {
    // Calculate service overlap count
    const servicesOverlap = project.services_needed.filter((service) =>
      vendor.services_offered.includes(service),
    ).length;

    // Ensure vendor properties are valid numbers
    const rating = Number(vendor.rating) || 0;
    const slaHours = Number(vendor.response_sla_hours) || 24;

    // Calculate SLA weight (better SLA = higher weight)
    const slaWeight = Math.max(0, ((48 - slaHours) / 48) * 10);

    // Score formula: services_overlap * 2 + rating + SLA_weight
    const score = servicesOverlap * 2 + rating + slaWeight;

    // Ensure score is a valid number and round to 2 decimal places
    const finalScore = isNaN(score) ? 0 : Math.round(score * 100) / 100;

    return finalScore;
  }

  private async sendMatchNotifications(
    project: Project,
    newMatches: Match[],
    existingMatches: Match[],
  ): Promise<void> {
    try {
      // Only send notifications for truly new matches
      const existingVendorIds = existingMatches.map((m) => m.vendor_id);
      const actuallyNewMatches = newMatches.filter(
        (match) => !existingVendorIds.includes(match.vendor_id),
      );

      if (actuallyNewMatches.length === 0) {
        return; // No new matches to notify about
      }

      // Get project with client details
      const projectWithClient = await this.projectRepository.findOne({
        where: { id: project.id },
        relations: ['client', 'client.user'],
      });

      if (!projectWithClient?.client?.user) {
        return; // Can't send notification without client email
      }

      // Send notification for each new match
      for (const match of actuallyNewMatches) {
        const vendor = await this.vendorRepository.findOne({
          where: { id: match.vendor_id },
        });

        if (vendor) {
          await this.notificationsService.sendMatchCreatedNotification({
            clientEmail: projectWithClient.client.user.email,
            clientName:
              projectWithClient.client.company_name || 'Valued Client',
            projectTitle: `${project.country} Expansion Project`,
            projectCountry: project.country,
            vendorName: vendor.name,
            matchScore: Number(match.score),
            projectId: project.id,
            matchId: match.id,
          });
        }
      }
    } catch (error) {
      // Don't fail the match creation if notification fails
      console.error('Failed to send match notifications:', error);
    }
  }
}
