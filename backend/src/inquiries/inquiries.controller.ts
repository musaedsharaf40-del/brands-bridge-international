import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { InquiryFilterDto } from './dto/inquiry-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { InquiryStatus } from '@prisma/client';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  // ==================== PUBLIC ENDPOINT ====================

  @Post()
  @Public()
  @ApiOperation({ summary: 'Submit a new inquiry (Public)' })
  @ApiResponse({ status: 201, description: 'Inquiry submitted successfully' })
  create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiryDto);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inquiries (Admin)' })
  @ApiResponse({ status: 200, description: 'Inquiries retrieved successfully' })
  findAll(@Query() filter: InquiryFilterDto) {
    return this.inquiriesService.findAll(filter);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry statistics (Admin)' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  getStats() {
    return this.inquiriesService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Inquiry retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry (Admin)' })
  @ApiResponse({ status: 200, description: 'Inquiry updated successfully' })
  update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
    return this.inquiriesService.update(id, updateInquiryDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry status (Admin)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  updateStatus(@Param('id') id: string, @Body('status') status: InquiryStatus) {
    return this.inquiriesService.updateStatus(id, status);
  }

  @Patch(':id/notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add notes to inquiry (Admin)' })
  @ApiResponse({ status: 200, description: 'Notes added successfully' })
  addNote(@Param('id') id: string, @Body('notes') notes: string) {
    return this.inquiriesService.addNote(id, notes);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete inquiry (Admin)' })
  @ApiResponse({ status: 200, description: 'Inquiry deleted successfully' })
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(id);
  }
}
