import { Inject, Injectable } from '@nestjs/common';
import { ConnectConfig } from 'rxjs';
import { CreateTaskDto } from 'src/modules/auth/dto/create-task.dto';

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
        const query = 'SELECT * FROM task WHERE id='${ id }'';
        const [result] = await this.db.query(query)
        return [0]


    }

    public async insert(tasks: CreateTaskDto): Promise<any> {
          //Agregar el query
    const sql= 'INSERT INTO tasks VALUES(name, description, priority, user_id)' VALUES ('${task.name}', '${task.description}', '${task.priority}', '${task.id}')
    const [result]=await this.getTaskById.query(sql);
    const inserid = result.insertid;
    const row = await this.getTaskById(insertid):
    return row;

    }


    public async update(id:number, taskUpdate:any):Promise<any>{
        const task = await this.getTaskById(id);

        task.name = taskUpdate.name ? taskUpdate.name : task.name;
        task.description = taskUpdate.description ?? task.description;
        task.priority = taskUpdate.priority ?? task.priority ;
    }


    public delete(id: number): string {
        const array = this.task.filter(t => t.id != id);
        this.task = array;
        return "Task Deleted";
    }
}