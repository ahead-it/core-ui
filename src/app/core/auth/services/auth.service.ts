import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SettingsService } from '../../services/settings.service';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private settings: SettingsService) 
  {
  }

  login(user: string, password: string): Observable<any> {
    return this.http.post<any>(environment.baseUrl + this.settings.loginUrl,
        { user, password }).pipe(catchError(this.handleError('login', [])));
  }

  /*
     * Submit forgot password request
     *
     * @param {string} email
     * @returns {Observable<any>}
     */
  public requestPassword(user: string): Observable<any> {
    return this.http.post<string>(environment.baseUrl + this.settings.forgotPswUrl,
        { user }).pipe(catchError(this.handleError('forgot-password', [])));
  }

  /*
 	 * Handle Http operation that failed.
 	 * Let the app continue.
     *
	 * @param operation - name of the operation that failed
 	 * @param result - optional value to return as the observable result
 	 */
   private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
        // TODO: send the error to remote logging infrastructure
        console.error(error.error.message); // error); // log to console instead

        // Let the app keep running by returning an empty result.
        return of(error.error); // result
    };
}
}
