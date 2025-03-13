import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal, ViewChild } from '@angular/core';
import { TodosService } from './../../shared/services/todos.service';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { throwError } from 'rxjs';
import { TodoFormTypes } from '../../core/models/enums/utils.enum';
import { ITodoEditReq, ITodoRes, IWebSocketMessage } from '../../core/models/interfaces/todos.interface';
import { WebSocketService } from '../../core/services/websocket.service';
import { HelperBaseComponent } from '../../shared/base/base-helper.component';
import { FormsService } from '../../shared/services/forms.service';
import { StateService } from '../../shared/services/state.service';


@Component({
  selector: 'app-todos-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './todos-table.component.html',
  styleUrl: './todos-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodosTableComponent extends HelperBaseComponent {
  @ViewChild(MatSort) sort!: MatSort;
  public completedList = signal(new Set<ITodoRes>());
  public selection = signal(new Set<string>());
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<ITodoRes> = new MatTableDataSource<ITodoRes>([]);

  constructor(
    private todosService: TodosService,
    private stateService: StateService,
    private formsService: FormsService,
    private webSocketService: WebSocketService,
    private cd: ChangeDetectorRef,
    dialog: MatDialog,
  ) {
    super(dialog)
    this.displayedColumns = this.stateService.tableColumnNames;

    effect(() => {
      this.todosService.getTodos().subscribe({
        next: (data: ITodoRes[]) => {
          if (data) {
            console.log("🔥 UI Should Update - New Todos List:", this.stateService.todosList);
            this.dataSource.data = [...this.stateService.todosList]; // Force change detection
            this.dataSource._updateChangeSubscription(); // Ensure MatTable refresh
          }
        },
        error: () => throwError(() => console.error('Error with data rendering'))
      });
      this.webSocketLiveMessaging();
    }, { allowSignalWrites: true });
  }

  public toggleCompleted(row: ITodoRes): void {
    if (row.isEditing) {
      console.warn("Cannot complete a Todo while it's being edited");
      return;
    }
    this.webSocketService.toggleComplete(row.title, !row.completed);
    this.selection.update((selction) => {
      const newSelection = new Set([...selction]);
      if (newSelection.has(row.title)) {
        newSelection.delete(row.title);
        row.completed = false;
      } else {
        newSelection.add(row.title);
        row.completed = true;
      }
      return newSelection;
    });
  }

  public editItem(todo: ITodoRes): void {
    if (todo.isEditing) {
      console.warn("Another user is already editing this Todo..");
      return;
    }
    this.webSocketService.lockTodo(todo.title, todo._id);
    this.stateService.currentTodo = todo;
    const form = todo as ITodoEditReq;
    const row = this.formsService.editTodoFormReq(form);
    this.openDialog(TodoFormTypes.editTodoForm, row)
      .afterClosed().subscribe(() => {
        this.webSocketService.unlockTodo(todo.title, todo._id);
      });
  }

  public deleteItem(todo: ITodoRes) {
    if (todo.isEditing) {
      console.warn("Cannot delete a Todo being edited!");
      return;
    }
  }

  private webSocketLiveMessaging(): void {
    this.webSocketService.messages$.subscribe((message: IWebSocketMessage) => {
      console.log("🔴 Received WebSocket Message:", message);

      if (!message || !message.type) return;

      switch (message.type) {
        case "LOCK_TODO":
          this.stateService.updateTodoLock(message.todoId, message.clientId ?? null);
          break;
        case "UNLOCK_TODO":
          this.stateService.updateTodoLock(message.todoId, null);
          break;
        case "TOGGLE_COMPLETE":
          if (message.completed !== undefined) {
            this.stateService.updateTodoCompletion(message.todoId, message.completed);
          }
          break;
        case "CREATE":
          if (message.todo) {
            console.log("🟢 New Todo received:", message.todo);
            this.stateService.todosList = [...this.stateService.todosList, message.todo]; // Force update
          }
          break;
        case "DELETE":
          if (message) {
            console.log("🟡 Deleting Todo:", message.id);
            this.stateService.todosList = this.stateService.todosList.filter(todo => todo._id !== message.id);
          }
          break;
        case "READ":
          if (message.todos) {
            console.log("🔵 Receiving Todos from WS:", message.todos);
            this.stateService.todosList = [...message.todos]; // Replace list with latest
          }
          break;
      }
    });
  }
}
