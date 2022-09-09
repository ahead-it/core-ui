import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent, MainPaneComponent } from '..';

const routes: Routes = [
	{
		path: '',
		component: MainPaneComponent
	}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [BaseComponent, MainPaneComponent]
})
export class MainPaneModule { }
