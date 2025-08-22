import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entity/user.entity';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vendor (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Vendor created successfully',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({
    status: 200,
    description: 'List of vendors',
    type: [VendorResponseDto],
  })
  async findAll(
    @Query('country') country?: string,
    @Query('service') service?: string,
  ) {
    if (country) {
      return this.vendorsService.findByCountry(country);
    }
    if (service) {
      return this.vendorsService.findByService(service);
    }
    return this.vendorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor details',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Vendor updated successfully',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(+id, updateVendorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete vendor (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async remove(@Param('id') id: string) {
    await this.vendorsService.remove(+id);
    return { message: 'Vendor deleted successfully' };
  }
}
