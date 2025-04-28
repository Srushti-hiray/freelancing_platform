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
        
        skills.forEach((skill, index) => {
         query.andWhere('user.skills LIKE :skill', { skill: `${skill}` });
        });
      }

    return query.getMany();
  }

  
}