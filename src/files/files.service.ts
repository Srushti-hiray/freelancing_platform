import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './files.entity';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private projectsService: ProjectsService,
    private usersService: UsersService,
  ) {}

  async upload(file: Express.Multer.File, projectId: number, userId: number): Promise<File> {
    if (!['application/pdf', 'image/jpeg', 'image/png', 'application/msword'].includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const project = await this.projectsService.findOne(projectId);
    const user = await this.usersService.findOne(userId);
    const filePath = path.join('uploads', file.filename);

    const fileEntity = this.filesRepository.create({
      project,
      user,
      filePath,
      fileType: file.mimetype,
    });
    return this.filesRepository.save(fileEntity);
  }

  async findByProject(projectId: number): Promise<File[]> {
    return this.filesRepository.find({ where: { project: { id: projectId } }, relations: ['user'] });
  }

  async findOne(id: number): Promise<File> {
    const file = await this.filesRepository.findOne({ where: { id } });
    if (!file) {
      throw new BadRequestException('File not found');
    }
    return file;
  }

  async download(id: number): Promise<{ buffer: Buffer; filename: string; mimetype: string }> {
    const file = await this.findOne(id);
    const filePath = path.join(process.cwd(), file.filePath);
    
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found on disk');
    }

    const buffer = fs.readFileSync(filePath);
    const filename = path.basename(file.filePath);
    
    return {
      buffer,
      filename,
      mimetype: file.fileType
    };
  }
}