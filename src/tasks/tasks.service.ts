import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    const term: string = search?.toLowerCase().trim();

    const filteredTasks = this.tasks.filter(
      (task) =>
        (!status || task.status === status) &&
        (!term ||
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)),
    );

    return filteredTasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: v4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    const [deletedTask] = this.tasks.splice(taskIndex, 1);
    return deletedTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const targetTask = this.getTaskById(id);

    if (targetTask) {
      targetTask.status = status;
    }

    return targetTask;
  }
}
