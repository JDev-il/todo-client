import { DialogRef } from '@angular/cdk/dialog';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, Inject, signal, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { TodoFormTypes } from '../../../core/models/enums/utils.enum';
import { ITodoFormEditReq, ITodoFormReq } from '../../../core/models/interfaces/forms.interface';
import { ITodoReq } from '../../../core/models/interfaces/todos.interface';
import { AddFormComponent } from '../../components/forms/add/add-form/add-form.component';
import { EditFormComponent } from '../../components/forms/edit/edit-form/edit-form.component';
import { StateService } from '../../services/state.service';
import { ITodoEditReq } from './../../../core/models/interfaces/todos.interface';
import { FormsService } from './../../services/forms.service';
import { TodosService } from './../../services/todos.service';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    AddFormComponent,
    EditFormComponent
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormDialogComponent {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  private destroy$ = new Subject<void>();
  public formInit: FormGroup<ITodoFormReq>;
  public dialogTitle = signal<string>('');
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { formType: TodoFormTypes, formRow: FormGroup<ITodoFormReq | ITodoFormEditReq> },
    private stateService: StateService,
    private formsService: FormsService,
    private todoService: TodosService,
    private dialogRef: DialogRef,
    private destroy: DestroyRef
  ) {
    effect(() => {
      if (this.data.formType) {
        const formTitle = this.data.formType;
        this.dialogTitle.set(formTitle);
      }
    }, { allowSignalWrites: true })

    if (data.formType === TodoFormTypes.addTodoForm) {
      this.formInit = this.formsService.initializeTodoFormReq();
    } else {
      this.formInit = data.formRow
    }
    this.destroy.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    })
  }

  public sendForm(form: FormGroup): void {
    if (this.data.formType === TodoFormTypes.addTodoForm) {
      const todo = form.value as ITodoReq;
      this.todoService.addTodo(todo).subscribe();
    } else {
      let todoEdit = form.getRawValue() as ITodoEditReq;
      todoEdit._id = this.stateService.currentTodo._id;
      this.todoService.editTodo(todoEdit).subscribe();
    }
    this.dialogActions();
  }

  private dialogActions(): void {
    this.formInit.reset();
    this.dialogRef.close();
  }

}
