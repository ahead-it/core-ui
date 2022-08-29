// Angular
import { Injectable, Injector, Inject } from '@angular/core';
// RxJS
import { Observable, BehaviorSubject } from 'rxjs';
// Models
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SettingsModel } from '../models/settings.model';
import { LogoTypeEnum } from '../enumerations/logo-type.enum';

import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable()
export class SettingsService {
	// Public properties
	settings$: BehaviorSubject<SettingsModel> = new BehaviorSubject<SettingsModel>(new SettingsModel());
	logo$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	logoSmall$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	background$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	icon$: BehaviorSubject<string> = new BehaviorSubject<string>('');

	private _configLoaded = false;
	initUrl = 'rpc/SessionManagement/initialize';
	loginUrl = 'rpc/SessionManagement/login';
	forgotPswUrl = 'rpc/SessionManagement/forgotpassword';

	get configLoaded(): boolean {
		return this._configLoaded;
	}

	set configLoaded(loaded: boolean) {
		this._configLoaded = loaded;

		const router = this.injector.get(Router);
		router.initialNavigation();
	}

	/**
	 * Service constructor
	 */
	constructor(private http: HttpClient, private injector: Injector, @Inject(DOCUMENT) private _document: Document) {
		// register on settings changed event and set default config
		// this.onSettingsUpdated$ = new Subject();
	}

	public initConfig(): Observable<any> {
		if (environment.production) {
			environment.baseUrl = window.location.origin + '/';

			let websocketPrefix = 'ws://';

			if (environment.baseUrl.includes('https'))
				websocketPrefix = 'wss://';

			environment.websocketUrl = websocketPrefix + window.location.host + '/ws';
		}

		const urlToCall: string = environment.baseUrl + this.initUrl;

		return this.http.post<any>(urlToCall, {}); // , { withCredentials: true}); // .pipe(
          // catchError(this.handleError
         // );
	}

    private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
		// A client-side or network error occurred. Handle it accordingly.
		console.error('An error occurred:', error.error.message);
		} else {

			alert(error.error.message);
			// RENDER TO ERROR PAGE
		}
		// return an observable with a user-facing error message
		// return throwError(
		// 'Something bad happened; please try again later.');
	}


	getLogo(type: LogoTypeEnum): Observable<Blob> {

		switch (type) {
			case LogoTypeEnum.Standard: {
				return this.http.get(environment.baseUrl + this.settings$.value.logo, { responseType: 'blob' });
			}

			case LogoTypeEnum.Small: {
				return this.http.get(environment.baseUrl + this.settings$.value.logo_small, { responseType: 'blob' });
			}
		}

	}

	getBackground(): Observable<Blob> {
		return this.http.get(environment.baseUrl + this.settings$.value.background, { responseType: 'blob' });
	}

	getIcon(): Observable<Blob> {
		return this.http.get(environment.baseUrl + this.settings$.value.icon, { responseType: 'blob' });
	}

	public createImageFromBlob(image: Blob, imageType: string) {
		const reader = new FileReader();
		reader.addEventListener('load', () => {

			if (reader.result === null) return;

			switch (imageType) {
				case 'logo':
					this.logo$.next(reader.result.toString());
					break;

				case 'logo_small':
					this.logoSmall$.next(reader.result.toString());
					break;

				case 'icon':
					this.icon$.next(reader.result.toString());
					break;

				case 'background':

					this.background$.next('url("' + reader.result.toString() + '")');
					break;

				default:
					break;

			}
		  }, false);

		if (image) {
		   reader.readAsDataURL(image);
		}
	 }

	isAuthenticated(): Observable<boolean> {

		// return of(this.authenticated);

		return this.settings$.pipe(
			map<SettingsModel, boolean>(settings => {
				return settings.authenticated;
			}));
	}

	setAuthenticated(val: boolean) {
		this.settings$.value.authenticated = val;
	}

	didConfigLoaded(): boolean {
		return this.configLoaded;
	}

	setAppFavicon() { // id: string, basepath: string, icon: string
		this._document.getElementById('appFavicon')?.setAttribute('href', this.icon$.value);
	}

	getLanguage(): string {
		return this.settings$.value?.language ?? 'it';
	}

	getLogoValue(type: LogoTypeEnum): BehaviorSubject<string> {
		switch (type) {
			case LogoTypeEnum.Standard: {
				return this.logo$;
			}
			case LogoTypeEnum.Small: {
				return this.logoSmall$;
			}
		}
	}

	getAppName() {
		return this.settings$.value?.name ?? '';
	}

	getStartPage() {
		return this.settings$.value?.startpage ?? '';
	}

	getStartPageId() {
		return this.settings$.value?.startpageid ?? '';
	}

	setStartPageId(value: string | undefined) {
		this.settings$.value.startpageid = value;
	}

	navigationEnabled(): boolean {
		return this.settings$.value?.navigation_enabled ?? true;
	}

	getDataSetSize(): number {
		return this.settings$.value?.dataset_size ?? 50;
	}
}
