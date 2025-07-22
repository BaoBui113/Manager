import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/entities/user.entity';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('job_posts')
export class JobPost extends BaseEntity {
  @Column()
  title: string;
  @Column({
    type: 'text',
  })
  description: string;
  @Column()
  status: string;

  @ManyToOne(() => Department, department => department.jobPosts)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User, user => user.jobPosts)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @OneToMany(() => JobApplication, jobApplication => jobApplication.jobPost)
  jobApplications: JobApplication[];
}
