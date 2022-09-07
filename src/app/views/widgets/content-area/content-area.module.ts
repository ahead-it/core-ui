import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent, ContentAreaComponent } from '..';

const routes: Routes = [
	{
		path: '',
		component: ContentAreaComponent
	}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [BaseComponent, ContentAreaComponent]
})
export class ContentAreaModule { }
