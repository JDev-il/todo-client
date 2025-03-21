import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodosTableComponent } from '../../pages/todos-table/todos-table.component';
import { HeaderComponent } from '../components/header/header.component';
import { TodosService } from '../services/todos.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [TodosTableComponent, HeaderComponent],
  providers: [TodosService],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  constructor(private todosService: TodosService) { }
}
