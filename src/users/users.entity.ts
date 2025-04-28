import { Entity, Column,OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../projects/projects.entity';
import { Message } from '../messages/messages.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  profile_Image: string;

  @Column({ type: 'enum', enum: ['client', 'freelancer'] })
  role: 'client' | 'freelancer';

  @OneToMany(() => Project, (project) => project.client)
  projectsAsClient: Project[];

  @OneToMany(() => Project, (project) => project.freelancer)
  projectsAsFreelancer: Project[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  // @OneToMany(() => File, (file) => file.user)
  // files: File[];
}