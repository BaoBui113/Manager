import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('performance_reviews')
export class PerformanceReview extends BaseEntity {
  @Column()
  period: string;
  @Column({
    type: 'integer',
  })
  score: number;
  @Column({
    type: 'text',
  })
  feedback: string;
  @ManyToOne(() => Employee, employee => employee.performanceReviews)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Employee, employee => employee.reviews)
  @JoinColumn({ name: 'reviewer_id ' })
  reviews: Employee;
}
