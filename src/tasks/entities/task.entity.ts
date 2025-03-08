import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
@Entity({
  name: 'tasks',
})
export class Task {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: '255',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: '255',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: '20',
  })
  status: TaskStatus;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
