import { Controller, Get, Post, Query, Patch, Param, Body, UseGuards, Request, ParseIntPipe, UsePipes, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, FilterProjectsDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';


@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  //@UsePipes(TransformQueryPipe)
  async findAll(@Query() filterDto: FilterProjectsDto) {
    return this.projectsService.findAll(filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}