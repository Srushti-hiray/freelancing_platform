import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './projects.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersModule } from '../users/users.module';
import { Bid } from '../bids/bids.entity';
import { Message } from '../messages/messages.entity';
import { File } from '../files/files.entity';
import { Milestone } from '../milestones/milestones.entity';
import { Invoice } from '../invoices/invoices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Bid, Message, File, Milestone, Invoice]), UsersModule],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}