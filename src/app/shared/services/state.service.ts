import { Injectable, signal, WritableSignal } from '@angular/core';
import { Actions } from '../../core/models/enums/utils.enum';
import { ITodoRes } from '../../core/models/interfaces/todos.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  private _todosList: WritableSignal<ITodoRes[]> = signal<ITodoRes[]>([]);
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

  public updateTodos(todo: ITodoRes, action: Actions): void {
    this._todosList.update((todos) => {
      if (action === Actions.UPDATE) {
        return todos.map((t) => (t._id === todo._id ? { ...t, ...todo } : t));
      }
      else if (todos.length >= 1) {
        return todos.filter(d => d._id !== todo._id);
      }
      else {
        return [];
      }
    });
  }

  public updateTodoLock(todoId: string, clientId: string | null): void {
    let todos = this.todosList || [];
    this.todosList = todos.map((todo: ITodoRes) => {
      return todo.title === todoId ? { ...todo, isEditing: clientId !== null } : todo
    }
    );
  }

  public updateTodoCompletion(todoId: string, completed: boolean): void {
    let todos = this.todosList || [];
    this.todosList = todos.map(todo =>
      todo.title === todoId ? { ...todo, completed } : todo
    );
  }

  public get tableColumnNames(): string[] {
    return ['title', 'description', 'completed', 'actions']
  }

}
