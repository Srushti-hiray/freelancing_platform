import { Entity, Column,JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from '../projects/projects.entity';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  title: string;

  @Column({ type: 'date',name: 'due_date' })
  dueDate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['pending', 'completed', 'paid'], default: 'pending' })
  status: 'pending' | 'completed' | 'paid';

  
}