import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/entities/user.entity';
// import { Task } from './task.model';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) { }
  /// NEW approaching
  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    console.log(user)
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }

  @Patch('/:id')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: FilterTaskDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    console.log("controller", user)

    return this.taskService.getTasks(filterDto, user);
  }

  /// OLD approaching
  // @Get()
  // getAllTasks(@Query(ValidationPipe) filterTodo: FilterTaskDto): Task[] {
  //   if (Object.keys(filterTodo).length) {
  //     return this.taskService.filterTasks(filterTodo);
  //   }
  //   return this.taskService.getAllTasks();
  // }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createTask(
  //   @Body() createTaskDto: CreateTaskDto
  // ): Task {
  //   return this.taskService.createTask(createTaskDto);
  // }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string) {
  //   return this.taskService.getTaskById(id);
  // }

  // @Delete('/:id')
  // deleteTaskById(@Param('id') id: string):void {
  //   this.taskService.deleteTaskById(id);
  // }

  // @Patch('/:id')
  // updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Task {
  //   return this.taskService.updateTask(id, updateTaskDto);
  // }
}
