import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoices.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { MilestonesService } from '../milestones/milestones.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    private milestonesService: MilestonesService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const milestone = await this.milestonesService.findOne(createInvoiceDto.milestoneId);
    const invoice = this.invoicesRepository.create({ ...createInvoiceDto, milestone });
    return this.invoicesRepository.save(invoice);
  }

  async findByMilestone(milestoneId: number): Promise<Invoice[]> {
    return this.invoicesRepository.find({ 
      where: { milestone: { id: milestoneId } },
      relations: ['milestone']
    });
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOneBy({ id });
    if (!invoice) throw new NotFoundException('Invoice not found');
    this.invoicesRepository.merge(invoice, updateInvoiceDto);
    return this.invoicesRepository.save(invoice);
  }
}