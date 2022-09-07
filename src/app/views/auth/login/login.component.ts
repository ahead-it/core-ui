// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { AuthService } from 'src/app/core/auth';
import { LoginTypeEnum, SettingsService } from 'src/app/core';


@Component({
	selector: '[login]',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm!: FormGroup;
	loading = false;
	isLoggedIn$!: Observable<boolean>;
	errors: any = [];

	submitted = false;

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		public settings: SettingsService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params['returnUrl'] || '/';
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next(null);
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		this.loginForm = this.fb.group({
			user: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320)
			])
			],
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});

		if (this.settings.settings$.value.login_type === LoginTypeEnum.Email) {
			this.loginForm.get('user')?.setValidators([Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320)]);
		  }
		  else {
			this.loginForm.get('user')?.setValidators([Validators.required,
				Validators.minLength(3),
				Validators.maxLength(320)]);
		};
	}

	/**
	 * Form Submit
	 */
	submit() {

		this.submitted = true;

		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			user: controls['user'].value,
			password: controls['password'].value
		};

		this.auth.login(authData.user, authData.password)
		.pipe(
			tap(res => {
				if (res && res.type === 'exception') {
					// this.authNoticeService.setNotice(res.message, 'danger'); // this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN')
				} else {
					this.settings.setAuthenticated(true);
					// this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.returnUrl}});
					// this.store.dispatch(new Login());
					this.router.navigateByUrl(''); // Main page
				}
			}),
			takeUntil(this.unsubscribe),
			finalize(() => {
				this.loading = false;
				this.cdr.markForCheck();
			})
		)
		.subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	getTextFieldType(): string {
		switch (this.settings.settings$.value.login_type) {
		  case LoginTypeEnum.UserId:
		  default: {
			return 'text';
		  }

		  case LoginTypeEnum.Email:
			return 'email';
		}
	}
}
