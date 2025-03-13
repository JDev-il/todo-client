import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TodoFormTypes } from '../../../core/models/enums/utils.enum';
import { HelperBaseComponent } from '../../base/base-helper.component';

@Component({
  selector: 'app-actions-bar',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './actions-bar.component.html',
  styleUrl: './actions-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsBarComponent extends HelperBaseComponent {
  constructor(dialog: MatDialog) {
    super(dialog)
  }
  public formDialog(): void {
    this.openDialog(TodoFormTypes.addTodoForm, new FormGroup({}));
  }
}
