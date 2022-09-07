import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MessageDialogData {
	title: string;
  message: string;
  retValue: boolean
}

@Component({
  selector: 'kt-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MessageDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: MessageDialogData) {
      dialogRef.disableClose = true;
	}

  ngOnInit() {
  }

  onConfirmClick(): void {
    if (this.data.retValue)
      this.dialogRef.close(true);
    else
      this.dialogRef.close();
  }
}
