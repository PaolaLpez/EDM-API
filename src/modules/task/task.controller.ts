import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { NotFoundError } from 'rxjs';
import { HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from 'src/modules/auth/dto/create-task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';

@Controller('api/task')
export class TaskController {

    constructor(private readonly taskSvc: TaskService) { }

    @Get()
    public async getTask(): Promise<any> {
        return await this.taskSvc.getTask();
    }

    @Get(":id")
    public async getTasksById(@Param("id", ParseIntPipe) id: number): Promise<any> {
        const result = await this.taskSvc.getTaskById(id);
        console.log("resultado", result);

        if (result == undefined)
            throw new HttpException("Tarea con ID ${id} no encontrada", HttpStatus.NOT_FOUND);
        return result;
    }

    @Post()
    public insertTask(@Body() task: CreateTaskDto) {
      const result = this.taskSvc.insert(task);
      if (result == undefined)
        throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR);
        return this.taskSvc.insert(task);
    }

    @Put("/:id")
    public updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto) {
        console.log("Tarea a actualizar", task)
      return this.taskSvc.update(id, task);
    }

    @Delete(":id")
    public deleteTask(@Param("id") id: any) {
        return this.taskSvc.delete(parseInt(id));
    }
}