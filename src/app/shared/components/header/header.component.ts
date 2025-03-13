import { Component } from '@angular/core';
import { ActionsBarComponent } from '../actions-bar/actions-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ActionsBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
