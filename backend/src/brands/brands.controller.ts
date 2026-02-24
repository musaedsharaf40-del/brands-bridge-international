import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  // ==================== PUBLIC ENDPOINTS ====================

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active brands' })
  @ApiResponse({ status: 200, description: 'Brands retrieved successfully' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  findAll(
    @Query('includeInactive') includeInactive?: boolean,
    @Query('featured') featured?: boolean,
  ) {
    return this.brandsService.findAll({ includeInactive, featured });
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured brands' })
  @ApiResponse({ status: 200, description: 'Featured brands retrieved successfully' })
  findFeatured() {
    return this.brandsService.findFeatured();
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get brand by slug' })
  @ApiResponse({ status: 200, description: 'Brand retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new brand (Admin)' })
  @ApiResponse({ status: 201, description: 'Brand created successfully' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update brand (Admin)' })
  @ApiResponse({ status: 200, description: 'Brand updated successfully' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle brand active status (Admin)' })
  @ApiResponse({ status: 200, description: 'Brand status toggled' })
  toggleActive(@Param('id') id: string) {
    return this.brandsService.toggleActive(id);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle brand featured status (Admin)' })
  @ApiResponse({ status: 200, description: 'Brand featured status toggled' })
  toggleFeatured(@Param('id') id: string) {
    return this.brandsService.toggleFeatured(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete brand (Admin)' })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
