import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Priority } from '../../../../../core/models/enums/utils.enum';
import { ITodoFormReq } from '../../../../../core/models/interfaces/forms.interface';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './edit-form.component.html',
  styleUrl: '../../../../style/form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditFormComponent {
  @Output() sendFormEmit: EventEmitter<FormGroup> = new EventEmitter();
  private _editTodoFormInit!: FormGroup<ITodoFormReq>;
  public priorityList = Object.values(Priority);

  @Input()
  set editTodoFormInit(value: FormGroup<ITodoFormReq>) {
    if (value) {
      this._editTodoFormInit = value;
    }
  }
  get editTodoFormInit(): FormGroup<ITodoFormReq> {
    return this._editTodoFormInit;
  }

  public formSubmit() {
    if (this.editTodoFormInit.valid) {
      this.sendFormEmit.emit(this.editTodoFormInit);
    }
  }
}
