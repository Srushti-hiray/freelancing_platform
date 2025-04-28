import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoices.entity';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { MilestonesModule } from '../milestones/milestones.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), MilestonesModule],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}