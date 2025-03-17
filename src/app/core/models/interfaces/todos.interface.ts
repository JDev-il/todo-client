import { Priority } from "../enums/utils.enum";
export interface ITodoRes {
  _id: string;
  title: string;
  description?: string,
  completed: boolean,
  priority?: Priority | string,
  dueDate: Date,
  createdBy: string,
  editedBy: string | null,
  isEditing: boolean,
  createdAt: string,
  updatedAt: string
}

export interface ITodoReq {
  title: string;
  description?: string,
  completed?: boolean,
  priority: Priority,
  dueDate: Date,
}

export interface ITodoEditReq {
  _id: string;
  title: string;
  description?: string,
  completed?: boolean,
  priority: Priority,
  dueDate: Date,
}

export interface IWebSocketMessage {
  id: string,
  type: "LOCK_TODO" | "UNLOCK_TODO" | "TOGGLE_COMPLETE" | "CREATE" | "DELETE" | "READ" | "UPDATE";
  todoId: string;
  clientId: string | null;
  completed?: boolean;
  todo?: ITodoRes;
  todos?: ITodoRes[];
}
