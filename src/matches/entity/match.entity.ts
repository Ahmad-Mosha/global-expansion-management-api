import { Project } from 'src/projects/entity/project.entity';
import { Vendor } from 'src/vendors/entity/vendor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('matches')
@Index(['project_id', 'vendor_id'], { unique: true })
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  project_id: string;

  @ManyToOne(() => Project, (project) => project.matches)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  vendor_id: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.matches)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
