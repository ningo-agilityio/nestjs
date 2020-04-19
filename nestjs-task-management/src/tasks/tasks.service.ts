import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    // Destructure dto 
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    }

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    return task;
  }

  deleteTaskById(id: string) {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== found.id);
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
    let selectedTask = this.getTaskById(id);
    const index = this.tasks.indexOf(selectedTask);
    selectedTask = {
      ...selectedTask,
      status: updateTaskDto.status
    };
    console.log(selectedTask);
    this.tasks[index] = selectedTask;
    return selectedTask;
  }

  filterTasks(filterTask: FilterTaskDto): Task[] {
    const { status, search } = filterTask;
    let tasks = this.getAllTasks();

    if(status) {
      tasks = tasks.filter(task => task.status === status);  
    }

    if(search) {
      tasks = tasks.filter(task => task.title.indexOf(search) > -1 || task.description.indexOf(search) > -1);  
    }

    return tasks;
  }
}
