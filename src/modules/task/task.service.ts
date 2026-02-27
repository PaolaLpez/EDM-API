import { Inject, Injectable } from '@nestjs/common';
import { ConnectConfig } from 'rxjs';
import { CreateTaskDto } from 'src/modules/task/dto/create.task.dto';
import { UpdateTaskDto } from 'src/modules/task/dto/update.task.dto';

@Injectable()
export class TaskService {

    constructor(
        @Inject('MYSQL_CONNECTION') private db: any
    ) { }

    private task: any[] = [];

    public async getTask(): Promise<any> {
        const query = 'SELECT * FROM task';
        const [result]: any = await this.db.query(query);

        return result;
    }

    public async getTaskById(id: number): Promise<any> {
        const query = "SELECT * FROM task WHERE id='${ id }'";
        const [result] = await this.db.query(query)
        return [0]
    }

    public async insert(tasks: CreateTaskDto): Promise<any> {
        const sql = "INSERT INTO tasks (name, description, priority, user_id)VALUES (${task.name}, ${task.description}, ${task.priority}, ${task.users_id} )"
        const [result] = await this.db.query(sql);
        const insertId = result.insertId;

        const row = await this.getTaskById(insertId);
        return row;
    }

    public async update(id: number, taskUpdate: UpdateTaskDto): Promise<any> {
        const task = await this.getTaskById(id);
        task.name = taskUpdate.name ? taskUpdate.name : task.name;
        task.description = task.Update.description ?? task.description;
        task.priority = task.Update.priority ?? task.priority;

      const query = `
        UPDATE task 
        SET name='${task.name}',
         description='${task.description}',
          priority=${task.priority}
           WHERE id=${id}`

        await this.db.query(query);
        return await this.getTaskById(id);
    }


    public delete(id: number): string {
        const array = this.task.filter(t => t.id != id);
        this.task = array;
        return "Task Deleted";
    }
}