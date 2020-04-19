import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { FilterTaskDto } from './dto/filter-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // Destructure dto 
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.save();

    return task;
  }

  async getTasks(filterDto: FilterTaskDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }

    const tasks = await query.getMany();
    return tasks;
  }
}