// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { LoginTypeEnum, SettingsService } from 'src/app/core';
import { AuthService } from 'src/app/core/auth';


@Component({
	selector: '[forgotpassword]',
	templateUrl: './forgot-password.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
	// Public params
	forgotPasswordForm!: FormGroup;
	loading = false;
	errors: any = [];

	submitted = false;

	private unsubscribe: Subject<any>;

	/**
	 * Component constructor
	 *
	 * @param authService
	 * @param authNoticeService
	 * @param translate
	 * @param router
	 * @param fb
	 * @param cdr
	 */
	constructor(
		private authService: AuthService,
		private router: Router,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		public settings: SettingsService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.initRegistrationForm();
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
	initRegistrationForm() {
		this.forgotPasswordForm = this.fb.group({
			user: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320)
			])
			]
		});

		if (this.settings.settings$.value.login_type === LoginTypeEnum.Email) {
			this.forgotPasswordForm.get('user')?.setValidators([Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320)]);
		  }
		  else {
			this.forgotPasswordForm.get('user')?.setValidators([Validators.required,
				Validators.minLength(3),
				Validators.maxLength(320)]);
		};
	}

	/**
	 * Form Submit
	 */
	submit() {

		this.submitted = true;
		const controls = this.forgotPasswordForm.controls;
		
		/** check form */
		if (this.forgotPasswordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const user = controls['user'].value;
		this.authService.requestPassword(user).pipe(
			tap(response => {
				if (response) {
					if (response.class === 'Exception') {
						// this.authNoticeService.setNotice(response.message, 'danger');
					}
					else {
						// this.authNoticeService.setNotice(response, 'success');
						// this.authNoticeService.setNotice(this.translate.instant('AUTH.FORGOT.SUCCESS'), 'success');
						this.router.navigateByUrl('/auth/login');
					}
				} else {
					// this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.NOT_FOUND',
					/*this.settings.settings$.value.login_type === LoginTypeEnum.Email ?
					{name: this.translate.instant('AUTH.INPUT.EMAIL')} : {name: this.translate.instant('AUTH.INPUT.USER')}), 'danger');*/
				}
			}),
			takeUntil(this.unsubscribe),
			finalize(() => {
				this.loading = false;
				this.cdr.markForCheck();
			})
		).subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.forgotPasswordForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
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
