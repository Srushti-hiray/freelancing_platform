import { Controller, Post, Get, Patch, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('milestone/:milestoneId')
  async findByMilestone(@Param('milestoneId', ParseIntPipe) milestoneId: number) {
    return this.invoicesService.findByMilestone(milestoneId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }
}