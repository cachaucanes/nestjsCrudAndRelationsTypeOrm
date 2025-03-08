import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from '../entities/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Task 1 description',
      status: TaskStatus.PENDING,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '9afdb191-421d-4a5e-b008-6462a42740f3',
      title: 'this is my title sof',
      description: 'my description sog',
      status: TaskStatus.PENDING,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'b6d51d6e-8018-4c57-a992-2a52dc287b2a',
      title: 'this is my title 1',
      description: 'my description',
      status: TaskStatus.PENDING,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '7e155db7-4749-41d6-96e1-fd76f904e158',
      title: 'this is my title 45',
      description: 'my description sdf',
      status: TaskStatus.PENDING,
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  getAllTasks() {
    return this.tasks;
  }
  createTask(payload: CreateTaskDto): Task {
    const { title, description } = payload;
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.PENDING,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }
  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      // throw new Error(`Task with id ${id} not found`); //Se rompe la aplicacion en la consola
      throw new NotFoundException(`Task with id ${id} not found`);
      /* //Error personalizado
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      ); */
    }
    return task;
  }
  getTaskByTitle(title: string): Task {
    console.log('mi titulos----', title);

    const task = this.tasks.find((task) => task.title === title);
    if (!task) {
      throw new NotFoundException(`Task with title ${title} not found`);
    }
    return task;
  }
  getTaskByActive(active: boolean): Task[] {
    const task = this.tasks.filter((task) => task.active === active);
    if (!task) {
      throw new NotFoundException(`Task with active ${active} not found`);
    }
    return task;
  }
  updateTask(id: string, updateFields: UpdateTaskDto): Task {
    const task = this.getTaskById(id);
    const newTask = { ...task, ...updateFields };
    this.tasks = this.tasks.map((task) => (task.id === id ? newTask : task));
    return newTask;
  }
  deleteTask(id: string) {
    if (!this.tasks.find((task) => task.id === id)) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return 'Task deleted';
  }
}
