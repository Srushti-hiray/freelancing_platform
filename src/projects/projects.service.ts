import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './projects.entity';
import { CreateProjectDto, FilterProjectsDto, UpdateProjectDto } from './dto/project.dto';
import { UsersService } from '../users/users.service';
import { Bid } from '../bids/bids.entity';
import { Message } from '../messages/messages.entity';
import { File } from '../files/files.entity';
import { Milestone } from '../milestones/milestones.entity';
import { Invoice } from '../invoices/invoices.entity';
import { In } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private usersService: UsersService,
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    @InjectRepository(Milestone)
    private milestonesRepository: Repository<Milestone>,
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(createProjectDto: CreateProjectDto, clientId: number): Promise<Project> {
    const client = await this.usersService.findOne(clientId);
    const project = this.projectsRepository.create({ ...createProjectDto, client });
    return this.projectsRepository.save(project);
  }

  async findAll(filterDto: FilterProjectsDto): Promise<Project[]> {
    const query = this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .leftJoinAndSelect('project.freelancer', 'freelancer');
      
    if (filterDto.category) {
      query.andWhere('project.category = :category', { category: filterDto.category });
    }
    if (filterDto.minBudget) {
      query.andWhere('project.budget >= :minBudget', { minBudget: filterDto.minBudget });
    }
    if (filterDto.maxBudget) {
      query.andWhere('project.budget <= :maxBudget', { maxBudget: filterDto.maxBudget });
    }
    if (filterDto.minDeadline) {
      query.andWhere('project.deadline <= :minDeadline', { minDeadline: filterDto.minDeadline });
    }
    
    // Filter by freelancerId if provided
    if (filterDto.freelancerId) {
      query.andWhere('freelancer.id = :freelancerId', { freelancerId: filterDto.freelancerId });
    }

    // Filter by clientId if provided
    if (filterDto.clientId) {
      query.andWhere('client.id = :clientId', { clientId: filterDto.clientId });
    }
    
    // Active projects filter (only show projects without a freelancer)
    if (filterDto.activeOnly) {
      query.andWhere('project.freelancer IS NULL');
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client', 'freelancer'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    if (updateProjectDto.freelancerId) {
      const freelancer = await this.usersService.findOne(updateProjectDto.freelancerId);
      project.freelancer = freelancer;
    }
    this.projectsRepository.merge(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: number): Promise<{ message: string }> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    // Cascade delete related invoices, milestones, files, bids, and messages
    // 1. Find all milestones for this project
    const milestones = await this.milestonesRepository.find({ where: { project: { id } } });
    const milestoneIds = milestones.map(m => m.id);
    if (milestoneIds.length > 0) {
      await this.invoicesRepository.delete({ milestone: { id: In(milestoneIds) } });
      await this.milestonesRepository.delete({ project: { id } });
    }
    await this.filesRepository.delete({ project: { id } });
    await this.bidsRepository.delete({ project: { id } });
    await this.messagesRepository.delete({ project: { id } });
    await this.projectsRepository.remove(project);
    return { message: 'Project deleted successfully' };
  }
}