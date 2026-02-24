import { IsOptional, IsBoolean, IsInt, Min, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductFilterDto {
  @ApiPropertyOptional({ description: 'Search query' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Category ID filter' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Brand ID filter' })
  @IsUUID()
  @IsOptional()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Featured products only' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Include inactive products' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  includeInactive?: boolean;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
