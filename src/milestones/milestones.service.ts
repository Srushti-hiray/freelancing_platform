import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './milestones.entity';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestonesRepository: Repository<Milestone>,
    private projectsService: ProjectsService,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const project = await this.projectsService.findOne(createMilestoneDto.projectId);
    const milestone = this.milestonesRepository.create({ ...createMilestoneDto, project });
    return this.milestonesRepository.save(milestone);
  }

  async findByProject(projectId: number): Promise<Milestone[]> {
    return this.milestonesRepository.find({ where: { project: { id: projectId } } });
  }

  async findOne(id: number): Promise<Milestone> {
    const milestone = await this.milestonesRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!milestone) throw new NotFoundException('Milestone not found');
    return milestone;
  }

  async update(id: number, updateMilestoneDto: UpdateMilestoneDto): Promise<Milestone> {
    const milestone = await this.milestonesRepository.findOneBy({ id });
    if (!milestone) throw new NotFoundException('Milestone not found');
    this.milestonesRepository.merge(milestone, updateMilestoneDto);
    return this.milestonesRepository.save(milestone);
  }
}