import { Injectable } from '@angular/core';
import { MessageService, MessageTypeEnum, MessageMethodEnum,
    SettingsService, FieldTypeEnum } from '../../core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from '../../core/services/base.service';
import { LoadingService, LoadingTypeEnum } from './loading.service';
import { BrowserNavigationService } from './browser-navigation.service';
import { KeyActionEnum } from '../../core/enumerations/key-action.enum';
import { DataService } from '../../core/services/data.service';


@Injectable({
    providedIn: 'root'
  })
export class UIActionsService extends BaseService {

    public selectedControlId!: string;

    /***
	 * Service constructor
	 */
    constructor(private appSettings: SettingsService,
        public override messageService: MessageService,
        private browserNavigation: BrowserNavigationService,
        public override dataService: DataService, private loadingService: LoadingService, public dialog: MatDialog) {
            super(dataService, messageService);
	}

    //#region Item UI interactions

    /***
	 * Mouse Enter event
	 * @param e Event
     * @param controlId Control Id
	 */
	mouseEnter(e: Event, controlId: string) {
        this.setCurrentControlId(controlId);
        e.stopPropagation();
    }

    /***
	 * Input event
     * @param controlId Control Id
	 */
	input(controlId: string) { // e: Event
        this.setCurrentControlId(controlId);
	}

    itemClick(objectId: string, controlId: string) {
        // Avoid DOM events bubbling
        if (controlId !== this.selectedControlId) {
            return;
        }

        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.CtlInvoke, { method: MessageMethodEnum.Click, controlid: controlId }, objectId);
    }

    override getData(pageId: string, offset: number, limit: number, sorting?: any, filters?: string) {
        this.loadingService.startLoading(LoadingTypeEnum.Data);
        super.getData(pageId, offset, limit, sorting, filters);
    }

    /**
     * Double Click Event on Repeater Row
     */
    rowDoubleClick(objectId: string, controlId: string) {
        if (this.selectedControlId !== controlId) {
            return;
        }

        this.loadingService.startLoading(LoadingTypeEnum.Data);

        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.CtlInvoke, { method: MessageMethodEnum.DblClick, controlid: controlId }, objectId);
    }

    /**
     * Close Page Event
     */
    close(pageId: string) {
        this.browserNavigation.setLastClosedPageId(pageId);
        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.Close, { }, pageId);
    }

    /**
     * Validate an item
     * @param e Event that generate validation. It can be blur from input text or item selection in case of dropdown component.
     * @param pageId Page Id
     * @param controlId Control Id
     */
    itemValidate(e: any, pageId: string, controlId: string) {
        // Avoid DOM events bubbling
        /*if (controlId !== this.selectedControlId) {
            return;
        }*/

        let value = e.target ? e.target.value : (e.item ? e.item[0] : e);

        // Value to send must be always string
        if (e.item && e.item[0] !== undefined) // && typeof(e.item[0] === 'number'))
            value = e.item[0].toString();

        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.CtlInvoke, {
                method: MessageMethodEnum.Validate, controlid: controlId, value }, pageId);
    }

    /*dateValidate(e, currentDate: NgbDate, pageId: string, controlId: string) {
        if (currentDate?.equals(e))
            return;

        let dateStr;

        // Multilanguage date format support
        switch (this.appSettings.getLanguage()) {

            case 'it':
            default: {
                dateStr = ('0' + e.day).slice(-2) + '/' + ('0' + e.month).slice(-2) + '/' + e.year;
                break;
            }

            case 'en': {
                dateStr = e.year + '-' + e.month + '-' + e.day;
                break;
            }
        }

        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.CtlInvoke, {
                method: MessageMethodEnum.Validate, controlid: controlId, value: dateStr }, pageId);
    }*/

    dateTimeValidate(datetimeStr: string, fieldtype: FieldTypeEnum, pageId: string, controlId: string) {

        // Missing language management
        switch (fieldtype) {
            case FieldTypeEnum.DatePicker:
                datetimeStr = datetimeStr.substring(0, 10);
                break;
        }

        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.CtlInvoke, {
                method: MessageMethodEnum.Validate, controlid: controlId, value: datetimeStr }, pageId);
    }

    /*imageValidate(image: Image, pageId: string, controlId: string) {
        // Avoid DOM events bubbling
        if (controlId !== this.selectedControlId) {
            return;
        }

        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.CtlInvoke, {
                method: MessageMethodEnum.Validate, controlid: controlId, value: image ? image.url : '' }, pageId);
    }*/

    checkedChange(e: any, pageId: string, controlId: string) {
        // Avoid DOM events bubbling
        if (controlId !== this.selectedControlId) {
            return;
        }

        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.CtlInvoke,
            { method: MessageMethodEnum.Validate, controlid: controlId, value: e.target.checked, parsevalue: false }, pageId);
    }

    getRelated(pageId: string, controlId: string, textValue: any = '', offset: number, limit: number) {
        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.CtlInvoke, { method: MessageMethodEnum.GetRelated, controlid: controlId,
                value: textValue, offset, limit }, pageId);
    }

    /***
	 * Typeahead Input event
	 * @param e Event
     * @param controlId Control Id
	 */
	typeaheadInput(pageId: string, controlId: string, inputValue: string, offset = 0, limit = 0) {
        this.input(controlId);
        this.getRelated(pageId, controlId, inputValue, offset, limit);
    }

    //#region Events over repeater cells
    cellValidate(e: any, pageId: string, controlId: string) {
        this.itemValidate(e, pageId, controlId);
    }
    //#endregion

    //#endregion

    selectRows(pageId: string, selectedRows: any[]) {
        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.SelectRows, { rows: selectedRows }, pageId);
    }

    private setCurrentControlId(controlId: string) {
        if (this.selectedControlId === controlId) {
            return;
        }

		this.selectedControlId = controlId;
    }

    clearCurrentControlId() {
        if (this.selectedControlId === undefined || this.selectedControlId === '') {
            return;
        }

		this.selectedControlId = '';
    }

    preventEvent(e: Event) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    //#region Keyboard events
    detectKeyAction(e: any): KeyActionEnum {
		if ((e.which || e.keyCode) === 116 || (e.ctrlKey && e.keyCode === 82))
		  return KeyActionEnum.Refresh;
		else if (e.keyCode === 27 || e.key === 'Escape')
		  return KeyActionEnum.Escape;
        else if (e.keyCode === 13 || e.key === 'Enter')
		  return KeyActionEnum.Enter;
        else if (e.keyCode === 9 || e.key === 'Tab')
		  return KeyActionEnum.Tab;
        else if (e.keyCode === 37 || e.key === 'ArrowLeft')
		  return KeyActionEnum.ArrowLeft;
        else if (e.keyCode === 39 || e.key === 'ArrowRight')
		  return KeyActionEnum.ArrowRight;
        else if (e.keyCode === 38 || e.key === 'ArrowUp')
		  return KeyActionEnum.ArrowUp;
        else if (e.keyCode === 40 || e.key === 'ArrowDown')
		  return KeyActionEnum.ArrowDown;

		return KeyActionEnum.None;
    }
    //#endregion
}