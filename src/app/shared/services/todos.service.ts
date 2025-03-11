import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITodo } from '../../core/models/interfaces/Todo.interface';
import { ApiService } from '../../core/services/api.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class TodosService {

  constructor(private stateService: StateService, private apiService: ApiService) { }

  public getTodos(): Observable<ITodo[]> {
    return of([])
  }

  public addTodo(todo: ITodo): void {
  }

  public editTodo(todoId: string): void { }

  public deleteTodo(todoId: string): void { }


}
