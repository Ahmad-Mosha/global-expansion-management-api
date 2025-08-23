import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Match } from '../matches/entity/match.entity';
import { Vendor } from '../vendors/entity/vendor.entity';
import { Project } from '../projects/entity/project.entity';
import { DocumentEntity } from '../documents/schemas/document.schema';
import {
  TopVendorsResponseDto,
  CountryAnalyticsDto,
  TopVendorDto,
} from './dto/top-vendors-response.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentEntity>,
  ) {}

  async getTopVendors(): Promise<TopVendorsResponseDto> {
    // Get all countries from projects
    const countries = await this.projectRepository
      .createQueryBuilder('project')
      .select('DISTINCT project.country', 'country')
      .getRawMany();

    const analytics: CountryAnalyticsDto[] = [];

    for (const { country } of countries) {
      // Get top 3 vendors for this country (avg match score last 30 days)
      const topVendors = await this.getTopVendorsForCountry(country);

      // Get document count for projects in this country
      const documentCount = await this.getDocumentCountForCountry(country);

      analytics.push({
        country,
        topVendors,
        documentCount,
      });
    }

    return { analytics };
  }

  private async getTopVendorsForCountry(
    country: string,
  ): Promise<TopVendorDto[]> {
    // Get matches for projects in this country from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topVendorsData = await this.matchRepository
      .createQueryBuilder('match')
      .innerJoin('match.project', 'project')
      .innerJoin('match.vendor', 'vendor')
      .select([
        'vendor.id as vendorId',
        'vendor.name as vendorName',
        'AVG(match.score) as avgScore',
        'COUNT(match.id) as totalMatches',
      ])
      .where('project.country = :country', { country })
      .andWhere('match.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('vendor.id, vendor.name')
      .orderBy('avgScore', 'DESC')
      .limit(3)
      .getRawMany();

    return topVendorsData.map((data) => ({
      id: data.vendorId,
      name: data.vendorName,
      avgMatchScore: parseFloat(data.avgScore),
      totalMatches: parseInt(data.totalMatches),
    }));
  }

  private async getDocumentCountForCountry(country: string): Promise<number> {
    // Get all project IDs for this country
    const projects = await this.projectRepository.find({
      where: { country },
      select: ['id'],
    });

    const projectIds = projects.map((p) => p.id);

    if (projectIds.length === 0) {
      return 0;
    }

    // Count documents linked to these projects in MongoDB
    return this.documentModel.countDocuments({
      projectId: { $in: projectIds },
    });
  }
}
