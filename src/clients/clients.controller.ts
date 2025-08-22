import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entity/user.entity';

export class CreateClientProfileDto {
  companyName: string;
  contactEmail: string;
}

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create client profile for current user' })
  @ApiResponse({
    status: 201,
    description: 'Client profile created successfully',
  })
  @ApiResponse({ status: 400, description: 'Client profile already exists' })
  async createProfile(
    @Body() createClientDto: CreateClientProfileDto,
    @CurrentUser() user: User,
  ) {
    try {
      const client = await this.clientsService.createForExistingUser(
        user.id,
        createClientDto.companyName,
        createClientDto.contactEmail,
      );
      return {
        message: 'Client profile created successfully',
        client: {
          user_id: client.user_id,
          company_name: client.company_name,
          contact_email: client.contact_email,
        },
      };
    } catch (error) {
      return { message: error.message };
    }
  }
}
