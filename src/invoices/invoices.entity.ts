import { Entity,JoinColumn, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Milestone } from '../milestones/milestones.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Milestone, { nullable: false })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['pending', 'paid'], default: 'pending' })
  status: 'pending' | 'paid';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}