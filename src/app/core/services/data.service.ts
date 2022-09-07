import { BehaviorSubject, Observable } from 'rxjs';
import { DataTypeEnum } from '../enumerations/data-type.enum';
import { ControlTypeEnum } from '../enumerations/control-type.enum';
import { Data } from '../classes/data';
import { GetDataActionEnum, SettingsService } from '..';
import { Injectable } from '@angular/core';
import { FiltersModel } from '../models/filters.model';

@Injectable({
    providedIn: 'root'
  })
export class DataService {

    // Public properties
    contentData: {[key: string]: Data} = {};
    contentData$: {[key: string]: BehaviorSubject<Data>} = {};
    contentDataSbj$: BehaviorSubject<{[key: string]: Data}> = new BehaviorSubject<{[key: string]: Data}>({});

    contentDropDownData: {[key: string]: Data} = {};
    contentDropDownDataSbj$: BehaviorSubject<{[key: string]: Data}> = new BehaviorSubject<{[key: string]: Data}>({});

    repeatersCurrentPage: {[key: string]: number} = {};
    repeatersCurrentFilters: {[key: string]: FiltersModel} = {};
    repeaterPageSize$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    dropdownPageSize = 20;

    setRepeaterCurrentFilters(pageid: string, filterType: GetDataActionEnum, filter: any) {
        switch(filterType) {
            default:
            case GetDataActionEnum.Search: {
                this.repeatersCurrentFilters[pageid].search = filter;
                break;
            }

            case GetDataActionEnum.Sort: {
                this.repeatersCurrentFilters[pageid].sort = filter;
                break;
            }
        }
    }

    initRepeaterCurrentFilters(pageid: string) {

        if (!this.repeatersCurrentFilters)
            this.repeatersCurrentFilters = {};

        if (!this.repeatersCurrentFilters[pageid])
            this.repeatersCurrentFilters[pageid] = new FiltersModel();
    }

	getFormattedData(controlType: ControlTypeEnum, pageid: string): Observable<any[]> {
        // filter: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<any[]> {

        const formattedData$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        formattedData$.next(this.formatData(controlType, pageid));
        return formattedData$.asObservable();
	}

    formatData(controlType: ControlTypeEnum, pageid: string): any[] {

        const dataToFormat: any = this.contentData[pageid]?.dataSet;

        let formattedRow: any[] = [];
        const formattedDataArray: any[] = [];

        if (dataToFormat && // && this.contentData[pageid]?.dataSetLength > 0
            this.contentData[pageid]?.schema) { // this.contentAreaDataCount$.value > 0

            dataToFormat.forEach((row: { [x: string]: any; }, rowIndex: any) => {

                formattedRow = [];

                this.contentData[pageid]?.schema.forEach((schemaEl: { type: any; hasformat: any; }, schemaElIndex: string | number) => {

                    switch (schemaEl.type) {

                        case DataTypeEnum.Boolean: {

                            // I booleani vanno formattati solo se sono nel repeater;
                            // nelle cards sono visualizzati sotto forma di checkbox
                            // e quindi viene utilizzato il valore originale, non formattato
                            if (schemaEl.hasformat && controlType === ControlTypeEnum.Repeater) {
                                this.formatValue(schemaElIndex, formattedRow, pageid, rowIndex);
                            }
                            else {
                                formattedRow.push(row[schemaElIndex]);
                            }

                            break;
                        }

                        default: {
                            if (schemaEl.hasformat) {
                                this.formatValue(schemaElIndex, formattedRow, pageid, rowIndex);
                            }
                            else {
                                formattedRow.push(row[schemaElIndex]);
                            }
                            break;
                        }
                    }
                });

                formattedDataArray.push(formattedRow);

            });
        }

        return formattedDataArray;
    }

    /**
     * Format a specific element of the schema.
     */
    formatValue(schemaElIndex: string | number, formattedRow: any[], pageid: string, rowIndex: string | number) {
        const frow = this.contentData[pageid]?.formattedDataSet[rowIndex];
        const fval = frow[schemaElIndex];
        formattedRow.push(fval);
    }

    resetPageSize() {
        if (this.repeaterPageSize$.value < this.appSettings.getDataSetSize())
            this.repeaterPageSize$.next(this.appSettings.getDataSetSize());
    }

    /**
     * Clear all behaviour subject properties
     */
    public clearAll() {

        // Clear page data
        this.contentData = {};
        this.contentData$ = {};
        this.contentDataSbj$.next({});

        // Clear dropdowns data
        this.contentDropDownData = {};
        this.contentDropDownDataSbj$.next({});

        this.repeatersCurrentFilters = {};
    }

    /**
     * Clear all behaviour subject properties for a specific page
     */
    public clearPageData(pageid: string) {

        // Clear page data
        delete this.contentData[pageid];
        delete this.contentData$[pageid];
        this.contentDataSbj$.next(this.contentData);

        // Clear dropdowns data
        delete this.contentDropDownData[pageid];
        this.contentDropDownDataSbj$.next(this.contentDropDownData);

        delete this.repeatersCurrentFilters[pageid];
    }

    public clearRepeaterFilters(pageid: string) {
        delete this.repeatersCurrentFilters[pageid];
    }

    constructor(private appSettings: SettingsService) {
        /*this.onNewMessageCreated$ = new Subject();
        this.onNewGenericMessageCreated$ = new Subject();*/
        this.repeaterPageSize$.next(this.appSettings.getDataSetSize());
    }
}
