import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InquiryType } from '@prisma/client';

export class CreateInquiryDto {
  @ApiPropertyOptional({ enum: InquiryType, default: InquiryType.GENERAL })
  @IsEnum(InquiryType)
  @IsOptional()
  type?: InquiryType;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Acme Corporation' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ example: 'United Arab Emirates' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'Partnership Inquiry' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ example: 'I am interested in becoming a distribution partner...' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
