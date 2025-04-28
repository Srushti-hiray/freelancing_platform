import { Entity, Column,JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from '../projects/projects.entity';
import { User } from '../users/users.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  duration: number;

  @Column({ type: 'text' })
  message: string;
}