import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { NotFoundError } from 'rxjs';
import { HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from 'src/modules/auth/dto/create-task.dto';
import { UpdateTaskDto } from 'src/modules/auth/dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('api/task')
export class TaskController {

    constructor(private readonly taskSvc: TaskService) { }

    @Get()
    public async getTask(): Promise<Task[]> {
        return await this.taskSvc.getTask();
    }

    @Get(":id")
    public async getTasksById(@Param("id", ParseIntPipe) id: number): Promise<Task> {
        const result = await this.taskSvc.getTaskById(id);
        console.log("resultado", result);

        if (result == undefined)
            throw new HttpException("Tarea con ID ${id} no encontrada", HttpStatus.NOT_FOUND);
        return result;
    }

    @Post()
    public insertTask(@Body() task: CreateTaskDto): Promise<Task> {
        const result = this.taskSvc.insert(task)
        if (result == undefined)
            throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR);
        return result;
    }

    @Put("/:id")
    public updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto) {
        console.log("Tarea a actualizar", task);
        return this.taskSvc.update(id, task);
    }

    @Delete(":id")
    public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<string>{
        const result = await this.taskSvc.delete(id);
        if (!result)
            throw new HttpException("No se puede eliminar la tarea", HttpStatus.NOT_FOUND)
        return result;
    }
}