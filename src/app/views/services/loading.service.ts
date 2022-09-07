import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {

    private loadingSubject = new BehaviorSubject<boolean>(false);
    private loadingCounter = 0;

    private _currentLoadingType!: LoadingTypeEnum;
    public get currentLoadingType(): LoadingTypeEnum {
        return this._currentLoadingType;
    }
    public set currentLoadingType(value: LoadingTypeEnum) {
        this._currentLoadingType = value;
    }

    public loadingText = '';

    constructor(
        private spinner: NgxSpinnerService) {
    }

    private showSpinner()
    {
        setTimeout(() => {
            this.spinner.show();
        });
    }

    private hideSpinner()
    {
        this.spinner.hide();
    }

    public startLoading(loadingType = LoadingTypeEnum.None) {

        this.loadingCounter++;

        if (this.loadingSubject.getValue() === true) {
            return;
        }

        this.currentLoadingType = loadingType;
        this.loadingSubject.next(true);

        this.setLoadingText(loadingType);
        this.showSpinner();
    }

    public stopLoading(reset = true) {

        if (reset)
            this.loadingCounter = 0;
        else {
            this.loadingCounter--;

            if(this.loadingCounter > 0) {
                return;
            }
        }

        this.loadingSubject.next(false);
        this.hideSpinner();

        this.currentLoadingType = LoadingTypeEnum.None;
    }

    setLoadingText(loadingType: LoadingTypeEnum) {

        switch (loadingType) {

            case LoadingTypeEnum.Data: {
                this.loadingText = 'Caricamento...';
                break;
            }

            case LoadingTypeEnum.WebSocketReconnection: {
                this.loadingText = 'Riconnessione in corso...';
                break;
            }

            default:
            case LoadingTypeEnum.None: {
                this.loadingText = '';
                break;
            }
        }
    }
}

/*
export enum LoadingUITypeEnum {
    None = 'none',
    Spinner = 'spinner',
    Dialog = 'dialog'
}
*/

export enum LoadingTypeEnum {
    None = 'none',
    Data = 'data',
    WebSocketReconnection = 'reconnect'
}

