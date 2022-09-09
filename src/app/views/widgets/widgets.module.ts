import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { NavBarComponent, NavBarItemComponent, SideBarComponent, SideBarItemComponent } from '.';

@NgModule({
  declarations: [
    NavBarComponent,
    NavBarItemComponent,
    SideBarComponent,
    SideBarItemComponent
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class WidgetsModule { }
