import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Kit Kat' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'كيت كات' })
  @IsString()
  @IsOptional()
  nameAr?: string;

  @ApiProperty({ example: 'kit-kat' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'Crispy wafer fingers covered in smooth milk chocolate' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'NEST-001' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: '/images/products/kit-kat.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: ['/images/products/kit-kat-1.jpg', '/images/products/kit-kat-2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsUUID()
  @IsOptional()
  brandId?: string;
}
