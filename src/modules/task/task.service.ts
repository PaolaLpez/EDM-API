import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  public getTasks(): string {
    return 'Lista de tareas';
  }

  public getTaskById(id: number): string {
    return `Tarea con el id ${id}`;
  }

  public insert(task: any): any {
    return task;
  }

  public update(id: number, task: any): any {
    return { id, ...task };
  }

  public delete(id: number): string {
    return `Tarea con el id ${id} eliminada`;
  }
}
