import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bids.entity';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bid]), ProjectsModule, UsersModule],
  providers: [BidsService],
  controllers: [BidsController],
})
export class BidsModule {}