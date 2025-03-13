import { Injectable, signal } from '@angular/core';
import { ITodoRes } from '../../core/models/interfaces/todos.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  private _todosList = signal<ITodoRes[]>([]);
  private _currentTodo = signal<ITodoRes>({} as ITodoRes);

  public set todosList(todos: ITodoRes[]) {
    this._todosList.set(todos)
  }
  public get todosList(): ITodoRes[] {
    return this._todosList();
  }

  public set currentTodo(todo: ITodoRes) {
    this._currentTodo.set(todo);
  }
  public get currentTodo(): ITodoRes {
    return this._currentTodo();
  }

  public get tableColumnNames(): string[] {
    return ['title', 'description', 'completed', 'actions']
  }

  public updateTodoLock(todoId: string, clientId: string | null): void {
    let todos = this.todosList || [];
    this.todosList = todos.map((todo: ITodoRes) =>
      todo.title === todoId ? { ...todo, isEditing: clientId !== null } : todo
    );
  }

  public updateTodoCompletion(todoId: string, completed: boolean): void {
    let todos = this.todosList || [];
    this.todosList = todos.map(todo =>
      todo.title === todoId ? { ...todo, completed } : todo
    );
  }

}
