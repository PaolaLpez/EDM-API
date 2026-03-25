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

    public async getTask(user_id: number): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({
            where: { user_id }
        });
        return tasks;
    }

    public async getTaskById(id: number, user_id: number): Promise<Task> {
        const task = await this.prisma.task.findUnique({
            where: { id, user_id }
        });
        return task;
    }

    public async insert(taskData: CreateTaskDto): Promise<Task> {
        const newTask = await this.prisma.task.create({
            data: taskData 
        });
        return newTask;
    }

 
    public async update(id: number, user_id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
        const task = await this.prisma.task.update({
            where: { id, user_id: user_id },
            data: taskUpdate
        });
        return task;
    }

    public async delete(id: number, user_id: number): Promise<Task> { 
        const task = await this.prisma.task.delete({
            where: { id, user_id: user_id }
        });
        return task;
    }
}