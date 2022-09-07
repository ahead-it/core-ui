import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUtilsService, CoreService, DataService, MessageService, ObjectUtilsService, SettingsService, WebSocketService } from '.';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [DataService, MessageService, SettingsService, WebSocketService, CoreService, AppUtilsService, ObjectUtilsService]
})
export class CoreModule { }
