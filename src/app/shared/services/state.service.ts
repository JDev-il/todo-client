import { Injectable, signal, WritableSignal } from '@angular/core';
import { ITodo } from '../../core/models/interfaces/Todo.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  private todosList: WritableSignal<ITodo[] | null> = signal<ITodo[] | null>(null);
  private currentTodo: WritableSignal<ITodo | null> = signal<ITodo | null>(null);
}
