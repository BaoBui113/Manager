import { JobPost } from 'src/job_posts/entities/job_post.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
@Entity('job_applications')
export class JobApplication extends BaseEntity {
  @Column()
  full_name: string;
  @Column()
  email: string;
  @Column({
    type: 'text',
  })
  resume_url: string;
  @Column()
  status: string;
  @Column()
  applied_at: Date;
  @ManyToOne(() => JobPost, jobPost => jobPost.jobApplications)
  @JoinColumn({ name: 'job_post_id' })
  jobPost: JobPost;
}
