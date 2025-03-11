import { Priority } from "../enums/utils.enum";

export interface ITodo {
  title: string;
  description?: string,
  completed: boolean,
  priority?: Priority,
  dueDate: Date,
  createdBy: string, //User Ref
  editedBy: string | null, //User Ref
  isEditiing: boolean
}
