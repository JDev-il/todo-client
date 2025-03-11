import { Component } from '@angular/core';
import { TodosTableComponent } from '../../pages/todos-table/todos-table.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [TodosTableComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
