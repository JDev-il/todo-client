import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-todos-table',
  standalone: true,
  imports: [],
  templateUrl: './todos-table.component.html',
  styleUrl: './todos-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosTableComponent {

}
