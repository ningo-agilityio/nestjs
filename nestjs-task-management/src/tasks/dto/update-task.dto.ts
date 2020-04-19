import { TaskStatus } from "../task.model";
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;
}