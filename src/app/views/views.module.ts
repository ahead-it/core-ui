import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsModule } from './widgets/widgets.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { AuthModule } from './auth/auth.module';
import { BrowserNavigationService, DialogService, LayoutService, LoadingService } from '.';

@NgModule({
  imports: [
    AuthModule,
    CommonModule,
    DialogsModule,
    WidgetsModule
  ],
  declarations: [],
  exports: [],
  providers: [BrowserNavigationService, DialogService, LoadingService, LayoutService]
})
export class ViewsModule { }
