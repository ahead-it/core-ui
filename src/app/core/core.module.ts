import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService, DataService, MessageService, SettingsService, WebSocketService } from '.';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [DataService, MessageService, SettingsService, WebSocketService, CoreService]
})
export class CoreModule { }
