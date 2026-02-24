import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UploadsService {
  private readonly uploadsDir = join(__dirname, '..', '..', 'uploads');

  async getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  async listFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.uploadsDir);
      return files.filter((file) => !file.startsWith('.'));
    } catch {
      return [];
    }
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = join(this.uploadsDir, filename);
    
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch {
      throw new NotFoundException('File not found');
    }
  }

  async getFileInfo(filename: string) {
    const filePath = join(this.uploadsDir, filename);
    
    try {
      const stats = await fs.stat(filePath);
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        url: `/uploads/${filename}`,
      };
    } catch {
      throw new NotFoundException('File not found');
    }
  }
}
