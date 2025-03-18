import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal, ViewChild } from '@angular/core';
import { ITodoEditReq } from './../../core/models/interfaces/todos.interface';
import { TodosService } from './../../shared/services/todos.service';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TodoFormTypes } from '../../core/models/enums/utils.enum';
import { ITodoRes } from '../../core/models/interfaces/todos.interface';
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
    MatIconModule,
    CommonModule
  ],
  templateUrl: './todos-table.component.html',
  styleUrl: './todos-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodosTableComponent extends HelperBaseComponent {
  @ViewChild(MatSort) sort!: MatSort;
  public completedList = signal(new Set<ITodoRes>());
  public selection = signal(new Set<string>());
  public isSelection = signal(false);
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
    this.cd.markForCheck();
    this.displayedColumns = this.stateService.tableColumnNames;
    this.todosService.getTodos().subscribe();
    effect(() => {
      if (this.stateService.todosList) {
        this.dataSource.data = [...this.stateService.todosList];
        this.selection.set(new Set(this.stateService.todosList.map(x => x.completed ? x.title : '')))
        this.dataSource._updateChangeSubscription();
      }
    }, { allowSignalWrites: true });
  }

  public toggleCompleted(row: ITodoRes): void {
    if (row.isEditing) {
      console.warn("Cannot complete a Todo while it's being edited");
      return;
    }
    this.selection.update(() => {
      const newSelection = new Set([...this.selection()]);
      if (newSelection.has(row.title)) {
        newSelection.delete(row.title);
        row.completed = false;
      } else {
        newSelection.add(row.title);
        row.completed = true;
      }
      return newSelection;
    });
    this.isSelection.set(this.selection().size > 0);
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
      console.warn("Cannot delete a Todo is being edited!");
      return;
    }
    this.todosService.deleteTodo(todo).subscribe()
  }

  public updateComplete() {
    const todosToUpdate = this.stateService.todosList
      .map(todo => ({
        _id: todo._id,
        completed: todo.completed
      }));
    this.todosService.editManyTodos(todosToUpdate).subscribe(response => {
      this.isSelection.set(false);
    });
  }
}
