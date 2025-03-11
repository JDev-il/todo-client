import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StateService } from '../../shared/services/state.service';
import { ITodo } from '../models/interfaces/Todo.interface';
@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient, private stateService: StateService) { }


  public allTodosReq(): Observable<ITodo[]> {
    return of();
  }
  public addTodoReq(todoId: string): void { }
  public updateTodoReq(todoId: string): void { }
  public deleteTodoReq(todoId: string): void { }

}
