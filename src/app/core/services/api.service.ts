import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ITodoEditReq, ITodoReq, ITodoRes } from '../models/interfaces/todos.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.api.baseUrl
  private todosEnpoints = environment.api.todos;
  private todosUrls = {
    addTodo: `${this.baseUrl}${this.todosEnpoints.add}`,
    updateTodo: `${this.baseUrl}${this.todosEnpoints.update}`,
    deleteTodo: `${this.baseUrl}${this.todosEnpoints.delete}`
  }

  constructor(private http: HttpClient) { }

  public allTodosReq(): Observable<ITodoRes[]> {
    return this.http.get<ITodoRes[]>(this.baseUrl);
  }

  public addTodoReq(todoAdd: ITodoReq): Observable<ITodoRes> {
    return this.http.post<ITodoRes>(this.todosUrls.addTodo, todoAdd);
  }

  public editTodoReq(todoEdit: ITodoEditReq): Observable<ITodoRes[]> {
    const url = this.todosUrls.updateTodo.replace(":id", encodeURIComponent(todoEdit._id));
    return this.http.put<ITodoRes[]>(url, todoEdit);
  }

  public deleteTodoReq(todoDelete: ITodoRes): Observable<any> {
    const url = this.todosUrls.deleteTodo.replace(":id", encodeURIComponent(todoDelete._id));
    return this.http.delete<ITodoRes>(url);
  }

  public isCompletedUpdateReq(todo: ITodoRes): void {
    console.log(todo);
  }


}
