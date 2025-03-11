import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  providers: [FormBuilder],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
  constructor(private fb: FormBuilder) { }
}
