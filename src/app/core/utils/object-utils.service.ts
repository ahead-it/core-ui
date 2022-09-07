// Angular
import { Injectable } from '@angular/core';

@Injectable()
export class ObjectUtilsService {
	/**
	 * Service constructor
	 *
	 */
	constructor() { }

	isEmptyObject(obj: {} | undefined): boolean {

		if (obj === undefined)
			return true;

		return (obj && (Object.keys(obj).length === 0));
	  }
}