import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '@prisma/client';

export class UpdateContentDto {
  @ApiPropertyOptional({ enum: ContentType })
  @IsEnum(ContentType)
  @IsOptional()
  type?: ContentType;

  @ApiPropertyOptional({ example: 'Updated content value' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiPropertyOptional({ example: 'القيمة المحدثة' })
  @IsString()
  @IsOptional()
  valueAr?: string;

  @ApiPropertyOptional({ example: 'hero' })
  @IsString()
  @IsOptional()
  section?: string;
}
