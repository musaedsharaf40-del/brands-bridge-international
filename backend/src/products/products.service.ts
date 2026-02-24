import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this slug already exists');
    }

    if (createProductDto.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: createProductDto.sku },
      });

      if (existingSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async findAll(filter: ProductFilterDto) {
    const where: any = {};
    
    if (!filter.includeInactive) {
      where.isActive = true;
    }
    
    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    
    if (filter.brandId) {
      where.brandId = filter.brandId;
    }
    
    if (filter.featured !== undefined) {
      where.isFeatured = filter.featured;
    }
    
    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { sku: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          category: true,
          brand: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findFeatured(limit = 8) {
    return this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByCategory(categoryId: string, limit?: number) {
    return this.prisma.product.findMany({
      where: { categoryId, isActive: true },
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: {
        brand: true,
      },
    });
  }

  async findByBrand(brandId: string, limit?: number) {
    return this.prisma.product.findMany({
      where: { brandId, isActive: true },
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.slug) {
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          slug: updateProductDto.slug,
          NOT: { id },
        },
      });

      if (existingProduct) {
        throw new ConflictException('Product with this slug already exists');
      }
    }

    if (updateProductDto.sku) {
      const existingSku = await this.prisma.product.findFirst({
        where: {
          sku: updateProductDto.sku,
          NOT: { id },
        },
      });

      if (existingSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  async toggleActive(id: string) {
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async toggleFeatured(id: string) {
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async getStats() {
    const [total, active, featured, byCategory, byBrand] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isFeatured: true } }),
      this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
      }),
      this.prisma.brand.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
      }),
    ]);

    return {
      total,
      active,
      featured,
      byCategory: byCategory.map((c) => ({ id: c.id, name: c.name, count: c._count.products })),
      byBrand: byBrand.map((b) => ({ id: b.id, name: b.name, count: b._count.products })),
    };
  }
}
