import { FormControl } from "@angular/forms";

export interface ITodoFormReq {
  title: FormControl<string | null>;
  description?: FormControl<string | null>,
  completed?: FormControl<boolean | null>,
  priority: FormControl<string | null>,
  dueDate: FormControl<string | Date>,
}


export interface ITodoFormEditReq {
  _id: FormControl<string | null>;
  title: FormControl<string | null>;
  description?: FormControl<string | null>,
  completed?: FormControl<boolean | null>,
  priority: FormControl<string | null>,
  dueDate: FormControl<string | Date>,
}
