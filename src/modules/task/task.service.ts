import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'src/modules/task/dto/create.task.dto';
import { UpdateTaskDto } from 'src/modules/task/dto/update.task.dto';
import { PrismaService } from 'src/prisma.service'; 
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {

    constructor(
        private prisma: PrismaService 
    ) { }

    public async getTask(): Promise<any> {
        return await this.prisma.task.findMany();
    }

    public async getTaskById(id: number): Promise<any> {
        const task = await this.prisma.task.findUnique({
            where: { id }
        });
        return task;
    }

    public async insert(taskData: CreateTaskDto): Promise<any> {
        const newTask = await this.prisma.task.create({
            data: taskData 
        });
        return newTask;
    }

 
    public async update(id: number, taskUpdate: UpdateTaskDto): Promise<any> {
        const task = await this.prisma.task.update({
            where: { id },
            data: taskUpdate
        });
        return task;
    }

    public async delete(id: number): Promise<Task> { 
        const task = await this.prisma.task.delete({
            where: { id }
        });
        return task;
    }
}