import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsModule } from './widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    WidgetsModule
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class ViewsModule { }
