import { LoginTypeEnum } from '../enumerations/login-type.enum';

export class SettingsModel {
	background?: string;
	logo?: any | string;
	logo_small?: any | string;
	icon: any | string;
	name?: string;
	description?: string;
	copyright?: string;
	indicator?: string;
	authenticated: boolean = false;
	startpage?: string;
	label_signin?: string;
	label_pwdlostqst?: string;
	label_user?: string;
	label_password?: string;
	label_pwdlost?: string;
	label_back?: string;
	label_send?: string;
	label_credentials?: string;
	style_title?: any;
	login_type?: LoginTypeEnum;

	// TO CHECK
	language?: string;
	navigation_enabled: boolean = false;
	dataset_size?: number;
	startpageid?: string;

	constructor() {
		
	}
}
