import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Task, TaskStatus } from './task.model';
// import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from '../entities/task.entity';
import { TaskRepository } from './task.repository';
import { User } from 'src/entities/user.entity';
// import { TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  /// NEW approaching way
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    let task = await this.getTaskById(id, user);
    task.status = updateTaskDto.status;
    await task.save();
    return task;
  }

  async getTasks(filterDto: FilterTaskDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  //================================================================================
  /// OLD approaching way
  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   // Destructure dto 
  //   const { title, description } = createTaskDto;

  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN
  //   }

  //   this.tasks.push(task);
  //   return task;
  // }

  // getTaskById(id: string): Task {
  //   const task = this.tasks.find(task => task.id === id);

  //   if (!task) {
  //     throw new NotFoundException(`Task with id ${id} not found!`);
  //   }

  //   return task;
  // }

  // deleteTaskById(id: string) {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter(task => task.id !== found.id);
  // }

  // updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
  //   let selectedTask = this.getTaskById(id);
  //   const index = this.tasks.indexOf(selectedTask);
  //   selectedTask = {
  //     ...selectedTask,
  //     status: updateTaskDto.status
  //   };
  //   console.log(selectedTask);
  //   this.tasks[index] = selectedTask;
  //   return selectedTask;
  // }

  // filterTasks(filterTask: FilterTaskDto): Task[] {
  //   const { status, search } = filterTask;
  //   let tasks = this.getAllTasks();

  //   if(status) {
  //     tasks = tasks.filter(task => task.status === status);  
  //   }

  //   if(search) {
  //     tasks = tasks.filter(task => task.title.indexOf(search) > -1 || task.description.indexOf(search) > -1);  
  //   }

  //   return tasks;
  // }
}
