import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsModule } from './widgets/widgets.module';
import { BrowserNavigationService } from './services/browser-navigation.service';
import { DialogService } from './services/dialog.service';
import { LoadingService } from './services/loading.service';
import { DialogsModule } from './dialogs/dialogs.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  imports: [
    AuthModule,
    CommonModule,
    DialogsModule,
    WidgetsModule
  ],
  declarations: [],
  exports: [],
  providers: [BrowserNavigationService, DialogService, LoadingService]
})
export class ViewsModule { }
