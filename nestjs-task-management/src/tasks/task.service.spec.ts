import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task.model';

const mockUser = { id: 12, username: 'Test user' }
const mockTasksFactory = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
})

describe('TaskService', () => {
  let tasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksFactory }
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    tasksRepository = await module.get<TaskRepository>(TaskRepository);
  })

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      tasksRepository.getTasks.mockResolvedValue('test value')

      const filters: FilterTaskDto = { status: TaskStatus.IN_PROGRESS, search: 'task 1' }
      const result = await tasksService.getTasks(filters, mockUser)
      expect(tasksRepository.getTasks).toHaveBeenCalled()
      expect(result).toEqual('test value')
    })
  })

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve + return taks', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' }
      tasksRepository.findOne.mockResolvedValue(mockTask)
      const result = await tasksService.getTaskById(1, mockUser)
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id
        }
      })
      expect(result).toEqual(mockTask)
    })

    it('throw error for not found task', async () => {
      tasksRepository.findOne.mockResolvedValue(null)
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow()
    })
  })

  describe('createTask', () => {
    it('calls tasksRepository.create() and returns the result', async () => {
      const createTaskDto = { title: 'Task 01', description: 'Task desc' }
      const response = 'New task'
      tasksRepository.createTask.mockResolvedValue(response)
      const result = await tasksService.createTask(createTaskDto, mockUser)
      expect(tasksRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser)
      expect(result).toEqual(response)
    })
  })

  describe('deleteTask', () => {
    it('calls tasksRepository.delete() to delete a task', async () => {
      const response = { affected: 1 }
      tasksRepository.delete.mockResolvedValue(response)
      tasksService.deleteTask(1, mockUser)
      expect(tasksRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id })
    })

    it('throw error for not found task', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 })
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow()
    })
  })

  describe('updateTask', () => {
    it('update a task', async () => {
      const save = jest.fn().mockResolvedValue(true)
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save: save
      })

      const result = await tasksService.updateTask(1, { status: TaskStatus.DONE }, mockUser)
      expect(tasksService.getTaskById).toHaveBeenCalled()
      expect(save).toHaveBeenCalled()
      expect(result.status).toEqual(TaskStatus.DONE)
    })
  })
})