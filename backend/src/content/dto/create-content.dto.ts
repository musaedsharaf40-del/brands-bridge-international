import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({ example: 'hero_title' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiPropertyOptional({ enum: ContentType, default: ContentType.TEXT })
  @IsEnum(ContentType)
  @IsOptional()
  type?: ContentType;

  @ApiProperty({ example: 'Your Gateway to Global Brands' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: 'بوابتك للعلامات التجارية العالمية' })
  @IsString()
  @IsOptional()
  valueAr?: string;

  @ApiPropertyOptional({ example: 'hero' })
  @IsString()
  @IsOptional()
  section?: string;
}
