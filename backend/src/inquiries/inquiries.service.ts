import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { InquiryFilterDto } from './dto/inquiry-filter.dto';
import { InquiryStatus } from '@prisma/client';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(createInquiryDto: CreateInquiryDto) {
    return this.prisma.inquiry.create({
      data: createInquiryDto,
    });
  }

  async findAll(filter: InquiryFilterDto) {
    const where: any = {};
    
    if (filter.type) {
      where.type = filter.type;
    }
    
    if (filter.status) {
      where.status = filter.status;
    }
    
    if (filter.search) {
      where.OR = [
        { firstName: { contains: filter.search, mode: 'insensitive' } },
        { lastName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
        { company: { contains: filter.search, mode: 'insensitive' } },
        { subject: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      data: inquiries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    return inquiry;
  }

  async update(id: string, updateInquiryDto: UpdateInquiryDto) {
    await this.findOne(id);

    return this.prisma.inquiry.update({
      where: { id },
      data: updateInquiryDto,
    });
  }

  async updateStatus(id: string, status: InquiryStatus) {
    await this.findOne(id);

    const data: any = { status };
    
    if (status === InquiryStatus.RESPONDED) {
      data.respondedAt = new Date();
    }

    return this.prisma.inquiry.update({
      where: { id },
      data,
    });
  }

  async addNote(id: string, notes: string) {
    await this.findOne(id);

    return this.prisma.inquiry.update({
      where: { id },
      data: { notes },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.inquiry.delete({
      where: { id },
    });

    return { message: 'Inquiry deleted successfully' };
  }

  async getStats() {
    const [total, byStatus, byType, recent] = await Promise.all([
      this.prisma.inquiry.count(),
      this.prisma.inquiry.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.inquiry.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          type: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<string, number>),
      recent,
    };
  }
}
