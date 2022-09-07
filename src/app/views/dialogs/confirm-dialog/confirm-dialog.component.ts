import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
	title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  default: boolean;
}

@Component({
  selector: 'kt-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
		public dialogRef: MatDialogRef<ConfirmDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
      dialogRef.disableClose = true;
	}

  ngOnInit() {
  }
  

	onCancelClick(): void {
		this.dialogRef.close();
  }
  
  onConfirmClick(): void {
    this.dialogRef.close();
  }
}
