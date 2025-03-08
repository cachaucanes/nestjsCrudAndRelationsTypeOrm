import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  getAllTasks() {
    return this.taskService.getAllTasks();
  }
  @Get('title')
  @ApiOperation({ summary: 'Get task by title' })
  getTaskByTitle(@Query('title') title: string) {
    return this.taskService.getTaskByTitle(title);
  }
  @Get('active')
  @ApiOperation({ summary: 'Get task by active' })
  getTaskByActive(@Query('active', ParseBoolPipe) active: boolean) {
    return this.taskService.getTaskByActive(active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @HttpCode(HttpStatus.CREATED)
  createTask(@Body() newTask: CreateTaskDto) {
    return this.taskService.createTask(newTask);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  updateTask(@Param('id') id: string, @Body() updateFields: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateFields);
  }
}
