import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { ConfirmDialogComponent, FileUploadDialogComponent, MessageDialogComponent } from '.';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    FileUploadDialogComponent,
    MessageDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  providers: []
})
export class DialogsModule { }