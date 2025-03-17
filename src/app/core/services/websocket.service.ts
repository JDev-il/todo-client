import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { shareReplay, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { StateService } from '../../shared/services/state.service';
import { IWebSocketMessage } from './../models/interfaces/todos.interface';


@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private platformId = inject(PLATFORM_ID);
  private socket$ = new WebSocketSubject<IWebSocketMessage>("");
  private messagesSubject$ = new Subject<IWebSocketMessage>();
  public messages$ = this.messagesSubject$.asObservable().pipe(shareReplay(1));

  constructor(private stateService: StateService) {
    if (isPlatformBrowser(this.platformId)) {
      this.connect();
      return;
    }
  }

  private connect(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<IWebSocketMessage>({
        url: environment.wsUrl,
        deserializer: (msg: MessageEvent) => {
          try {
            return typeof msg.data === "string" ? JSON.parse(msg.data) : msg;
          } catch (error) {
            console.error("WebSocket deserialization error:", error);
            return { type: "UNKNOWN", todoId: "", clientId: "" };
          }
        }
      });

      this.socket$.subscribe({
        next: (message: IWebSocketMessage) => {
          console.log("WebSocket message received:", message);
          this.handleMessage(message);
        },
        error: (err) => {
          console.error("WebSocket error, attempting reconnect...", err);
          setTimeout(() => this.connect(), 3000); // 🛠 Auto-reconnect after 3s
        },
        complete: () => {
          console.warn("⚠ WebSocket closed, reconnecting...");
          setTimeout(() => this.connect(), 3000);
        }
      });

      console.log("WebSocket connection attempt sent.");
    }
  }

  public sendMessage(message: IWebSocketMessage | any): void {
    if (this.socket$) {
      try {
        this.socket$.next(message);
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
      }
    } else {
      console.error("WebSocket connection not established.");
    }
  }

  public lockTodo(todoId: string, clientId: string): void {
    this.sendMessage({ type: "LOCK_TODO", todoId, clientId });
  }

  public unlockTodo(todoId: string, clientId: string): void {
    this.sendMessage({ type: "UNLOCK_TODO", todoId, clientId });
  }

  public toggleComplete(todoId: string, completed: boolean): void {
    this.sendMessage({ type: "TOGGLE_COMPLETE", todoId, completed });
  }

  private handleMessage(message: IWebSocketMessage | null): void {
    if (!message || !message.type) return;

    switch (message.type) {
      case 'LOCK_TODO':
        if (message.clientId !== null) {
          this.stateService.updateTodoLock(message.todoId, message.clientId);
        }
        break;

      case 'UNLOCK_TODO':
        this.stateService.updateTodoLock(message.todoId, null);
        break;

      case 'TOGGLE_COMPLETE':
        if (message.completed !== undefined) {
          this.stateService.updateTodoCompletion(message.todoId, message.completed);
        }
        break;

      case 'CREATE':
        if (message.todo) {
          console.log("Created", message.todo);

          // this.stateService.updateTodo(message.todo);
        }
        break;

      case 'DELETE':
        /* this.stateService.todosList = this.stateService.todosList.filter(todo => todo._id !== message.id); */
        break;
    }
  }

}
