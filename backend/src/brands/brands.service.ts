import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    const existingBrand = await this.prisma.brand.findUnique({
      where: { slug: createBrandDto.slug },
    });

    if (existingBrand) {
      throw new ConflictException('Brand with this slug already exists');
    }

    return this.prisma.brand.create({
      data: createBrandDto,
    });
  }

  async findAll(options?: { includeInactive?: boolean; featured?: boolean }) {
    const where: any = {};
    
    if (!options?.includeInactive) {
      where.isActive = true;
    }
    
    if (options?.featured !== undefined) {
      where.isFeatured = options.featured;
    }

    return this.prisma.brand.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findFeatured() {
    return this.prisma.brand.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            category: true,
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            category: true,
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    await this.findOne(id);

    if (updateBrandDto.slug) {
      const existingBrand = await this.prisma.brand.findFirst({
        where: {
          slug: updateBrandDto.slug,
          NOT: { id },
        },
      });

      if (existingBrand) {
        throw new ConflictException('Brand with this slug already exists');
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.brand.delete({
      where: { id },
    });

    return { message: 'Brand deleted successfully' };
  }

  async toggleActive(id: string) {
    const brand = await this.findOne(id);

    return this.prisma.brand.update({
      where: { id },
      data: { isActive: !brand.isActive },
    });
  }

  async toggleFeatured(id: string) {
    const brand = await this.findOne(id);

    return this.prisma.brand.update({
      where: { id },
      data: { isFeatured: !brand.isFeatured },
    });
  }
}
