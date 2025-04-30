import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if ('profile_image' in updateUserDto && updateUserDto.profile_image) {
      user.profile_Image = updateUserDto.profile_image;
    } else if ('profileImage' in updateUserDto && updateUserDto.profileImage) {
      user.profile_Image = updateUserDto.profileImage;
    }
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async findFreelancers(skills?: string[]): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: 'freelancer' });
  
    if (skills && skills.length > 0) {
      // Create a condition that checks if the skills array contains all requested skills
      query.andWhere((qb) => {
        const subQuery = qb.subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.role = :role', { role: 'freelancer' });
        
        // For each skill, add a condition that the skills array contains it
        skills.forEach((skill, index) => {
          const paramName = `skill${index}`;
          subQuery.andWhere(`user.skills LIKE :${paramName}`, { 
            [paramName]: `%${skill}%` 
          });
        });
        
        return 'user.id IN ' + subQuery.getQuery();
      });
    }
  
    return query.getMany();
  }

  
}