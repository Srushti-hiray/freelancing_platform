import { Controller, Post, Get, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/bid.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('freelancer')
  @Post()
  async create(@Body() createBidDto: CreateBidDto, @Request() req) {
    return this.bidsService.create(createBidDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get('project/:projectId')
  async findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.bidsService.findByProject(projectId);
  }
}