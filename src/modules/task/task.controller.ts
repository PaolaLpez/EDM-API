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

interface Task {
  title: string;
  description: string;
}

@Controller('api/tasks')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  @Get()
  public getTasks(): string {
    return this.taskSvc.getTasks();
  }

  @Get(':id')
  public getTaskById(@Param('id') id: string): string {
    return this.taskSvc.getTaskById(parseInt(id));
  }

  @Post()
  public insertTask(@Body() task: any) {
    return this.taskSvc.insert(task);
  }

  @Put('/:id')
  public updateTask(@Param("id") id:string, @Body() task: any) {
    return this.taskSvc.update(parseInt(id));
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): string {
    return this.taskSvc.delete(parseInt(id));
  }
}
