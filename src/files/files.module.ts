import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './files.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ProjectsModule, UsersModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}