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
  UseGuards,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.models';

@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @HttpCode(HttpStatus.CREATED)
  createTask(@Body() newTask: CreateTaskDto) {
    return this.taskService.createTask(newTask);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  updateTask(@Param('id') id: string, @Body() updateFields: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateFields);
  }
}
