import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject, tap } from 'rxjs';
import { ITodoEditReq, ITodoReq, ITodoRes } from '../../core/models/interfaces/todos.interface';
import { ApiService } from '../../core/services/api.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class TodosService {
  public destroy$ = new Subject<void>();
  constructor(
    private stateService: StateService,
    private apiService: ApiService,
    private wsService: WebSocketService
  ) { }

  public getTodos(): Observable<ITodoRes[]> {
    return this.apiService.allTodosReq()
      .pipe(
        shareReplay(),
        tap((todosList: ITodoRes[]) => {
          this.stateService.todosList = todosList;
        })
      );
  }

  public addTodo(todo: ITodoReq): Observable<ITodoRes> {
    return this.apiService.addTodoReq(todo).pipe(
      tap((newTodo: ITodoRes) => {
        this.stateService.todosList = [...this.stateService.todosList, newTodo];
        this.wsService.sendMessage({ type: 'CREATE', todo: newTodo })
      }),
    );
  }

  public editTodo(todo: ITodoEditReq): Observable<ITodoRes[]> {
    return this.apiService.editTodoReq(todo).pipe(
      tap((updatedTodo) => {
        this.wsService.sendMessage({ type: 'UPDATE', todo: updatedTodo })
      })
    );
  }

  public deleteTodo(todo: ITodoRes): Observable<ITodoRes[]> {
    return this.apiService.deleteTodoReq(todo).pipe(
      tap((deletedTodo) => {
        this.wsService.sendMessage({ type: 'DELETE', todo: deletedTodo })
      })
    )
  }

  public completedStatusUpdate(todo: ITodoRes): void {
    this.apiService.isCompletedUpdateReq(todo);
  }
}
