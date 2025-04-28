import { Controller, Get, Post, Body, UseGuards, ConflictException } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/skill.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll() {
    return this.skillsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client', 'freelancer')
  async create(@Body() createSkillDto: CreateSkillDto) {
    try {
      return await this.skillsService.create(createSkillDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Skill already exists');
      }
      throw error;
    }
  }
}