import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { NavBarComponent, NavBarItemComponent } from '.';

@NgModule({
  declarations: [
    NavBarComponent,
    NavBarItemComponent
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class WidgetsModule { }
