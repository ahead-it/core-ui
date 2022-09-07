// Angular
import { Injectable } from '@angular/core';
import packageInfo from '../../../../package.json';

@Injectable()
export class AppUtilsService {
	/**
	 * Service constructor
	 *
	 */
	constructor() { }

	appVersion(): string {
		return packageInfo.version;
	  }
}