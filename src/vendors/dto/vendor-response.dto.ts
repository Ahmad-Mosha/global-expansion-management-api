import { ApiProperty } from '@nestjs/swagger';

export class VendorResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  countries_supported: string[];

  @ApiProperty()
  services_offered: string[];

  @ApiProperty()
  rating: number;

  @ApiProperty()
  response_sla_hours: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
