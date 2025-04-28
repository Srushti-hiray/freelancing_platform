import { Entity, Column, JoinColumn,PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Project } from '../projects/projects.entity';
import { User } from '../users/users.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project,{ nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  // @ManyToOne(() => Project)
  // project: Project;

  // @ManyToOne(() => User)
  // user: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ name: 'uploaded_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  
}