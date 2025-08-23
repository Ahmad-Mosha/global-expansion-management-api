import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entity/match.entity';
import { Project } from '../projects/entity/project.entity';
import { Vendor } from '../vendors/entity/vendor.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async rebuildMatches(projectId: string) {
    // Get project details
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Find eligible vendors using MySQL queries
    const eligibleVendors = await this.findEligibleVendors(project);

    // Calculate scores and prepare matches
    const matchData = eligibleVendors.map((vendor) => {
      const score = this.calculateScore(project, vendor);
      return {
        project_id: projectId,
        vendor_id: vendor.id,
        score,
      };
    });

    // Idempotent upsert - delete existing matches first, then insert new ones
    await this.matchRepository.delete({ project_id: projectId });

    if (matchData.length > 0) {
      await this.matchRepository.save(matchData);
    }

    return {
      message: 'Matches rebuilt successfully',
      projectId,
      matchesFound: matchData.length,
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

    // Calculate SLA weight (better SLA = higher weight)
    const slaWeight = Math.max(0, ((48 - vendor.response_sla_hours) / 48) * 10);

    // Score formula: services_overlap * 2 + rating + SLA_weight
    const score = servicesOverlap * 2 + vendor.rating + slaWeight;

    // Round to 2 decimal places
    return Math.round(score * 100) / 100;
  }
}
