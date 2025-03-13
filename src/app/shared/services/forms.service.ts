import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITodoFormReq } from '../../core/models/interfaces/forms.interface';
import { ITodoReq } from '../../core/models/interfaces/todos.interface';

@Injectable({ providedIn: 'root' })
export class FormsService {
  constructor(private fb: FormBuilder) { }

  public initializeTodoFormReq(): FormGroup {
    return this.fb.group({
      title: this.fb.control('', [Validators.required]),
      description: this.fb.control(''),
      priority: this.fb.control('', [Validators.required]),
      dueDate: this.fb.control('', [Validators.required])
    } as ITodoFormReq)
  }

  public editTodoFormReq(row: ITodoReq): FormGroup<ITodoFormReq> {
    return this.fb.group({
      title: this.fb.control(row.title, [Validators.required]),
      description: this.fb.control(row.description),
      completed: this.fb.control(row.completed),
      priority: this.fb.control(row.priority, [Validators.required]),
      dueDate: this.fb.control(row.dueDate, [Validators.required])
    } as ITodoFormReq)
  }
}
