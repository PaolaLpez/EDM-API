import { Injectable } from '@nestjs/common';

export interface Task {
  id: number;
  title: string;
}

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  public getTask(): Task[] {
    return this.tasks;
  }

  public getTaskById(id: number): string {
    return `Tarea con el id ${id}`;
  }

  public insert(task: Task): Task {
    this.tasks.push(task {
      ...task,
      id: this.tasks.length + 1
    }
    return task;
  }

  public update(id: number, task: Task): Task {
    const index = this.tasks.map(t => {
    if (t.id == id) {
      if (task.name) t.name = task.name;
      }
    }
    return t;

  }

  public delete(id: number): string {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return `Tarea con el id ${id} eliminada`;
  }
}
