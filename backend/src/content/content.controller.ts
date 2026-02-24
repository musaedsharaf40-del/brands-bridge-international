import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // ==================== PUBLIC ENDPOINTS ====================

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get all public content as key-value pairs' })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  getPublicContent() {
    return this.contentService.getPublicContent();
  }

  @Get('statistics')
  @Public()
  @ApiOperation({ summary: 'Get company statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStatistics() {
    return this.contentService.getStatistics();
  }

  @Get('values')
  @Public()
  @ApiOperation({ summary: 'Get company values' })
  @ApiResponse({ status: 200, description: 'Values retrieved successfully' })
  getValues() {
    return this.contentService.getValues();
  }

  @Get('services')
  @Public()
  @ApiOperation({ summary: 'Get company services' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  getServices() {
    return this.contentService.getServices();
  }

  @Get('partners')
  @Public()
  @ApiOperation({ summary: 'Get partners and certifications' })
  @ApiResponse({ status: 200, description: 'Partners retrieved successfully' })
  @ApiQuery({ name: 'type', required: false })
  getPartners(@Query('type') type?: string) {
    return this.contentService.getPartners(type);
  }

  @Get('settings')
  @Public()
  @ApiOperation({ summary: 'Get public settings' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  @ApiQuery({ name: 'group', required: false })
  getSettings(@Query('group') group?: string) {
    return this.contentService.getSettings(group);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all content (Admin)' })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  @ApiQuery({ name: 'section', required: false })
  findAll(@Query('section') section?: string) {
    return this.contentService.findAll(section);
  }

  @Get('key/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content by key (Admin)' })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  findByKey(@Param('key') key: string) {
    return this.contentService.findByKey(key);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new content (Admin)' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Patch('key/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content by key (Admin)' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  update(@Param('key') key: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(key, updateContentDto);
  }

  @Patch('settings/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update setting (Admin)' })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  updateSetting(@Param('key') key: string, @Body('value') value: string) {
    return this.contentService.updateSetting(key, value);
  }

  @Delete('key/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete content by key (Admin)' })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  remove(@Param('key') key: string) {
    return this.contentService.remove(key);
  }
}
