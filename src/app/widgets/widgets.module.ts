import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { NavBarComponent } from './navbar.component';
import { NavBarItemComponent } from './navbaritem.component';

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
