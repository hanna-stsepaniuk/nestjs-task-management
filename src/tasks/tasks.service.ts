import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { NOT_FOUND_MESSAGE } from './constants';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.getAllTasks();
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasksWithFilters(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.getTaskById(id);

    if (!task) {
      throw new NotFoundException(NOT_FOUND_MESSAGE);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.createTask(createTaskDto);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const deleteResult = await this.tasksRepository.deleteTask(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(NOT_FOUND_MESSAGE);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const updatedTask = await this.tasksRepository.updateTaskStatus(
      id,
      updateTaskStatusDto,
    );

    if (!updatedTask) {
      throw new NotFoundException(NOT_FOUND_MESSAGE);
    }

    return updatedTask;
  }
}
