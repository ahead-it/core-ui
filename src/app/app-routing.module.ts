// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Components
// import { BaseComponent } from './views/theme/base/base.component';

// Auth
import { AuthGuard } from './core';

const routes: Routes = [
  // {path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)},
  /*{
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
				path: '', // app
				loadChildren: () => import('./_portal/views/pages/content-area/content-area.module').then(m => m.ContentAreaModule)
			},
      {path: '', redirectTo: '', pathMatch: 'full'}, // redirectTo: 'app'
			{path: '**', redirectTo: '', pathMatch: 'full'} // app
    ],
  },*/
  {path: '**', redirectTo: '', pathMatch: 'full'}, // redirectTo: 'error/403'
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { initialNavigation: 'disabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
