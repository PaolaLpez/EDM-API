import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { NotFoundError } from 'rxjs';
import { HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from 'src/modules/auth/dto/create-task.dto';
import { UpdateTaskDto } from 'src/modules/auth/dto/update-task.dto';
import { Task } from './entities/task.entity';
import { request } from 'express';
import { Req } from '@nestjs/common';

@Controller('api/task')
export class TaskController {

    constructor(private readonly taskSvc: TaskService) { }

@Get()
public async getTask(@Req() req: any): Promise<Task[]> {
    const user = req.user;
    return await this.taskSvc.getTask(user);
}

    @Get(":id")
    public async getTasksById(@Param("id", ParseIntPipe) id: number): Promise<Task> {
        const user = request['user'];
        const result = await this.taskSvc.getTaskById(id, user.id);
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
        const user = request['user'];
        return this.taskSvc.update(id, user.id, task);
    }

    @Delete(":id")
    public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<boolean>{
     try{

     }catch(error){
        throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
     }
        return true;
    }
}