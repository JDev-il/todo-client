import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TodoFormTypes } from "../../core/models/enums/utils.enum";
import { FormDialogComponent } from "../dialogs/form-dialog/form-dialog.component";

export class HelperBaseComponent {
  constructor(protected dialog: MatDialog) { }

  protected openDialog(dialogFormType: TodoFormTypes, formRow: FormGroup): MatDialogRef<unknown> {
    return this.dialog.open(FormDialogComponent, {
      data: {
        formType: dialogFormType,
        formRow: formRow
      },
      disableClose: true
    });
  }
}
