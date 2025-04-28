import { Entity, Column,OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Message } from '../messages/messages.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @Column({ type: 'date' })
  deadline: string;

  @ManyToOne(() => User, (user) => user.projectsAsClient)
  //@Column({ name: 'client_id' }) // Map to client_id column
  @JoinColumn({ name: 'client_id' }) 
  client: User;

  @ManyToOne(() => User, (user) => user.projectsAsFreelancer, { nullable: true })
  //@Column({ name: 'freelancer_id', nullable: true }) // Map to freelancer_id column
  @JoinColumn({ name: 'freelancer_id' }) 
  freelancer: User;

  @OneToMany(() => Message, (message) => message.project)
  messages: Message[];

  // @OneToMany(() => File, (file) => file.project)
  // files: File[];
}