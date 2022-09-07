import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SettingsService } from "src/app/core";


@Component({
	selector: '[auth]',
	templateUrl: './auth.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
	// Public properties
	today: number = Date.now();
	// headerLogo: string;

	/**
	 * Component constructor
	 *
	 * @param settings: SettingsService
	 */
	constructor(
		public settings: SettingsService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		/*this.translationService.setLanguage(this.translationService.getSelectedLanguage());
		this.headerLogo = this.layoutConfigService.getLogo();

		this.splashScreenService.hide();*/
	}
}
