import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './bids.entity';
import { CreateBidDto } from './dto/bid.dto';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
    private projectsService: ProjectsService,
    private usersService: UsersService,
  ) {}

  async create(createBidDto: CreateBidDto, freelancerId: number): Promise<Bid> {
    const project = await this.projectsService.findOne(createBidDto.projectId);
    const freelancer = await this.usersService.findOne(freelancerId);
    const bid = this.bidsRepository.create({ ...createBidDto, project, freelancer });
    return this.bidsRepository.save(bid);
  }

  async findByProject(projectId: number): Promise<any[]> {
    const bids = await this.bidsRepository.find({ where: { project: { id: projectId } }, relations: ['freelancer'] });
    return bids.map(bid => ({
      ...bid,
      freelancerId: bid.freelancer?.id
    }));
  }
}