import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';

export class File {
  filedata: string | undefined;
  filename: string;
  fileextension: string;
  mimetype: string;
  mimedata!: string | ArrayBuffer | null;

  constructor(filename: string, fileextension: string, mimetype: string) { // mimedata: string | ArrayBuffer
    this.filename = filename;
    this.fileextension = fileextension;
    this.mimetype = mimetype;
  }
}

@Component({
  selector: 'kt-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent implements OnInit {

  @ViewChild('fileinput') fileInput: any;

  constructor(
		public dialogRef: MatDialogRef<FileUploadDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
      dialogRef.disableClose = true;
	}

  ngOnInit() {
  }

  openFile(){
    this.fileInput.nativeElement.click();
  }

  onFileInput(event: any){
    event.stopPropagation();
    this.uploadFile(event.target.files[0]);
  }

  uploadFile(file: any) {
    if(!file || file.length === 0) {
			return;
		}

    const fileNameExt = file.name.split('.');
    const fileToUpload = new File(fileNameExt[0], fileNameExt[1], file.type)

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = (_event) => {
      fileToUpload.mimedata = reader.result;
      fileToUpload.filedata = reader.result?.toString().split(',')[1];
      this.dialogRef.close(fileToUpload);
		}
  }

	onCancelClick(): void {
		this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close();
  }
}
