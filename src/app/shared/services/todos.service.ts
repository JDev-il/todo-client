import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject, take, tap } from 'rxjs';
import { Actions } from '../../core/models/enums/utils.enum';
import { ITodoEditReq, ITodoReq, ITodoRes, IWebSocketMessage } from '../../core/models/interfaces/todos.interface';
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
        shareReplay(1),
        tap((todosList: ITodoRes[]) => {
          this.wsService.sendMessage({ type: 'READ', todos: todosList })
          this.stateService.todosList = todosList;
        })
      );
  }

  public addTodo(todo: ITodoReq): Observable<ITodoRes> {
    return this.apiService.addTodoReq(todo).pipe(
      take(1),
      tap((newTodo: ITodoRes) => {
        console.log("???");

        this.stateService.todosList = [...this.stateService.todosList, newTodo];
        this.wsService.sendMessage(<IWebSocketMessage>{ type: 'CREATE', todo: newTodo })
      })
    );
  }

  public editTodo(todo: ITodoEditReq): Observable<ITodoRes> {
    return this.apiService.editTodoReq(todo).pipe(
      take(1),
      tap((updatedTodo: ITodoRes) => {
        this.stateService.updateTodos(updatedTodo, Actions.UPDATE);
        this.wsService.sendMessage(<IWebSocketMessage>{ type: 'UPDATE', todo: updatedTodo });
      })
    );
  }

  public deleteTodo(todo: ITodoRes): Observable<ITodoRes> {
    return this.apiService.deleteTodoReq(todo).pipe(
      take(1),
      tap((deletedTodo: ITodoRes) => {

        this.stateService.updateTodos(deletedTodo, Actions.DELETE);
        this.wsService.sendMessage(<IWebSocketMessage>{ type: 'DELETE', todo: deletedTodo })
      }),
    )
  }
}
