import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateStoreDto, UpdateStoreDto, SetWorkHoursDto } from '@dtos';
import { AuthGuard, Roles } from '@guards';
import { UserRole } from '@enums';
import { StoreEntity } from '@entities';
import { StoreService } from './store.service';
@ApiTags('Stores')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new store (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Store successfully created',
    type: StoreEntity,
  })
  public async createStore(
    @Request() req,
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<StoreEntity> {
    return this.storeService.createStore(req.user.sub, createStoreDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns store with work hours',
    type: StoreEntity,
  })
  public async getStoreWithWorkHours(@Request() req): Promise<StoreEntity> {
    return this.storeService.getStoreWithWorkHours(req.user.sub);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update store (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Store successfully updated',
    type: StoreEntity,
  })
  public async updateStore(
    @Request() req,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreEntity> {
    return this.storeService.updateStore(req.user.sub, updateStoreDto);
  }

  @Post('work-hours')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set store work hours (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Work hours successfully set',
    type: StoreEntity,
  })
  public async setWorkHours(
    @Request() req,
    @Body() setWorkHoursDto: SetWorkHoursDto,
  ): Promise<StoreEntity> {
    return this.storeService.setWorkHours(req.user.sub, setWorkHoursDto.workHours);
  }

  @Post('publish')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish store (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Store successfully published',
    type: StoreEntity,
  })
  public async publishStore(@Request() req): Promise<StoreEntity> {
    return this.storeService.publishStore(req.user.sub);
  }
}
