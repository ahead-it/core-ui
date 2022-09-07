import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, retryWhen, delay, retry } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageMethodEnum, MessageTypeEnum, SettingsService, WsMessage } from '..';
import { LoadingService, LoadingTypeEnum } from 'src/app/views/services/loading.service';

@Injectable({
    providedIn: 'root'
  })
  export class WebSocketService implements OnDestroy {

    /*
	 * Service constructor
	 */
	constructor(private loadingService: LoadingService, private appSettings: SettingsService) { //private loadingService: LoadingService, 
	}

    connection$: WebSocketSubject<any> | undefined;
    RETRY_SECONDS = 10;

    private getNewWebSocket(wsUrl: string) {
        return webSocket({
          url: wsUrl,
          openObserver: {
            next: () => {
                console.log('[DataService]: connection restored');

                if (this.loadingService.currentLoadingType === LoadingTypeEnum.WebSocketReconnection) {
                    this.loadingService.stopLoading();
                    this.reloadStartPage();
                }
            }
          },
          closeObserver: {
            next: (closeEvent) => {

                if (!closeEvent.wasClean) {
                    console.log('[DataService]: connection closed, try to reconnect...');
                }
            }
          },
        });
    }

    connect(reconnect = false): Observable<any> {
        return of(environment.websocketUrl).pipe(
            filter(apiUrl => !!apiUrl),
            // https becomes wss, http becomes ws
            map(apiUrl => apiUrl.replace(/^http/, 'ws')),
            switchMap(wsUrl => {
            if (this.connection$ && !this.connection$.closed) {
                return this.connection$;
            } else {
                this.connection$ = this.getNewWebSocket(wsUrl);

                console.log('Connesso al ws: ' + wsUrl);
                return this.connection$;
                return '';
            }
            }),
            retry({ delay: errors =>
                errors.pipe(delay(this.RETRY_SECONDS)) })
        );
    }

    send(data: any): Observable<WsMessage|undefined> {
        if (this.connection$) {
            this.connection$.next(data);
            return of(data);
        } else {
            console.error('Did not send data, open a connection first');
            return of(undefined);
        }
    }

    sendAndWait(data: any): Observable<any> {
        if (this.connection$) {
            this.connection$.next(data);
            return of(data);
        } else {
            console.error('Did not send data, open a connection first');
            return of(undefined);
        }
    }

    closeConnection() {
        if (this.connection$) {
            this.connection$.closed = true;
            this.connection$.complete();
            // this.connection$ = null;
        }
    }

    ngOnDestroy() {
        this.closeConnection();
    }

    reloadStartPage() {
        // this.loadingService.startLoading(LoadingTypeEnum.Data);

        const message = new WsMessage();
        message.type = MessageTypeEnum.Invoke;
        message.classname = this.appSettings.getStartPage();
        message.method = MessageMethodEnum.RunTask;
        message.arguments = { };

        this.send(message);
    }
}