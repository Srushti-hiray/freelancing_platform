import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skills.entity';
import { CreateSkillDto } from './dto/skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillsRepository.create(createSkillDto);
    return this.skillsRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillsRepository.find();
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillsRepository.findOne({ where: { id } });
    if (!skill) throw new Error('Skill not found');
    return skill;
  }
}