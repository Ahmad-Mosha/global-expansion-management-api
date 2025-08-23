import { ApiProperty } from '@nestjs/swagger';

export class TopVendorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  avgMatchScore: number;

  @ApiProperty()
  totalMatches: number;
}

export class CountryAnalyticsDto {
  @ApiProperty()
  country: string;

  @ApiProperty({ type: [TopVendorDto] })
  topVendors: TopVendorDto[];

  @ApiProperty()
  documentCount: number;
}

export class TopVendorsResponseDto {
  @ApiProperty({ type: [CountryAnalyticsDto] })
  analytics: CountryAnalyticsDto[];
}
