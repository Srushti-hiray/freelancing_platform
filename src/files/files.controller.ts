import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, UseGuards, Request, ParseIntPipe, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import * as path from 'path';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/:projectId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ) {
    console.log('UPLOAD ATTEMPT:', { file, projectId, userId: req.user?.id });
    return this.filesService.upload(file, projectId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:projectId')
  async findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.filesService.findByProject(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async downloadFile(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const file = await this.filesService.download(id);
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.buffer);
  }
}