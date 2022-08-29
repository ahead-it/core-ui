// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SettingsService } from '..';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private appSettings: SettingsService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
      return this.appSettings.isAuthenticated().pipe(
        map (res => {
            if (!res) {
                this.router.navigateByUrl('/auth/login');
            }

            return res;
        }), catchError((err) => {
            this.router.navigateByUrl('/auth/login');
            return of(false);
        })
    );
  }
}
