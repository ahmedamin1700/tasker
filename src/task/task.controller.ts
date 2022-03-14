import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { OwnerGuard } from 'src/auth/guards';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.create(createTaskDto, user.id);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(+id);
    if (!task) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return task;
  }

  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
