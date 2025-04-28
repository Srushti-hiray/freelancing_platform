import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { CreateMessageDto } from './dto/message.dto';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private projectsService: ProjectsService,
    private usersService: UsersService,
  ) {}

  async create(createMessageDto: CreateMessageDto, senderId: number): Promise<Message> {
    const project = await this.projectsService.findOne(createMessageDto.projectId);
    const sender = await this.usersService.findOne(senderId);
    const receiver = await this.usersService.findOne(createMessageDto.receiverId);
    const message = this.messagesRepository.create({ ...createMessageDto, project, sender, receiver });
    return this.messagesRepository.save(message);
  }

  async findByProject(projectId: number): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { project: { id: projectId } },
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }
}