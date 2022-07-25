import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

import { Task } from './task.entity';
import { TaskStatus } from './task.model';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private tasksDataSource: Repository<Task>,
  ) {}

  getTaskById(id: string): Promise<Task> {
    return this.tasksDataSource.findOneBy({ id });
  }

  getAllTasks(): Promise<Task[]> {
    return this.tasksDataSource.find();
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = filterDto;
    return this.tasksDataSource.find({
      where: [
        {
          ...(search && { title: Like(`%${search}%`) }),
          ...(status && { status }),
        },
        {
          ...(search && { description: Like(`%${search}%`) }),
          ...(status && { status }),
        },
      ],
    });
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksDataSource.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
    });

    await this.tasksDataSource.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    return this.tasksDataSource.delete(id);
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    const task = await this.getTaskById(id);

    if (!task) {
      return null;
    }

    task.status = status;
    const updatedTask = await this.tasksDataSource.save(task);
    return updatedTask;
  }
}
