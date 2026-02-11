import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';

import { TaskService } from './task.service';
import type { Task } from './task.service';

@Controller('api/tasks')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  @Get()
  public getTasks(): Task[] {
    return this.taskSvc.getTask();
  }

  @Get(':id')
  public getTaskById(@Param('id') id: string): string {
    return this.taskSvc.getTaskById(Number(id));
  }

  @Post()
  public insertTask(@Body() task: Task): Task {
    return this.taskSvc.insert(task);
  }

  @Put(':id')
  public updateTask(@Param('id') id: string, @Body() task: Task): Task {
    return this.taskSvc.update(Number(id), task);
  }

  @Delete(':id')
  public deleteTask(@Param('id') id: string): string {
    return this.taskSvc.delete(Number(id));
  }
}
