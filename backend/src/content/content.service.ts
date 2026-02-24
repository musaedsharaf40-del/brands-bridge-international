import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(createContentDto: CreateContentDto) {
    const existing = await this.prisma.content.findUnique({
      where: { key: createContentDto.key },
    });

    if (existing) {
      throw new ConflictException('Content with this key already exists');
    }

    return this.prisma.content.create({
      data: createContentDto,
    });
  }

  async findAll(section?: string) {
    const where = section ? { section } : {};
    
    return this.prisma.content.findMany({
      where,
      orderBy: { key: 'asc' },
    });
  }

  async findByKey(key: string) {
    const content = await this.prisma.content.findUnique({
      where: { key },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async findBySection(section: string) {
    return this.prisma.content.findMany({
      where: { section },
      orderBy: { key: 'asc' },
    });
  }

  async getPublicContent() {
    const contents = await this.prisma.content.findMany();
    
    // Transform to key-value object for easy frontend consumption
    return contents.reduce((acc, content) => {
      acc[content.key] = {
        value: content.value,
        valueAr: content.valueAr,
        type: content.type,
      };
      return acc;
    }, {} as Record<string, any>);
  }

  async update(key: string, updateContentDto: UpdateContentDto) {
    await this.findByKey(key);

    return this.prisma.content.update({
      where: { key },
      data: updateContentDto,
    });
  }

  async upsert(key: string, data: Omit<CreateContentDto, 'key'>) {
    return this.prisma.content.upsert({
      where: { key },
      update: data,
      create: { key, ...data },
    });
  }

  async remove(key: string) {
    await this.findByKey(key);

    await this.prisma.content.delete({
      where: { key },
    });

    return { message: 'Content deleted successfully' };
  }

  // Get all statistics
  async getStatistics() {
    return this.prisma.statistic.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Get all company values
  async getValues() {
    return this.prisma.value.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Get all services
  async getServices() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Get all partners
  async getPartners(type?: string) {
    const where: any = { isActive: true };
    if (type) {
      where.type = type;
    }
    
    return this.prisma.partner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Get settings
  async getSettings(group?: string) {
    const where = group ? { group } : {};
    
    const settings = await this.prisma.setting.findMany({ where });
    
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }

  // Update setting
  async updateSetting(key: string, value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
