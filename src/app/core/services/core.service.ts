import { Injectable} from '@angular/core';
import { MessageActionEnum } from '../enumerations/message-action.enum';
import { MessageService } from './message.service';
import { WebSocketService } from './websocket.service';
import { MessageTypeEnum } from '../enumerations/message-type.enum';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { MessageMethodEnum } from '../enumerations/message-method.enum';
// import { Logout } from 'src/app/core/auth';
// import { Store } from '@ngrx/store';
// import { AppState } from 'src/app/core/reducers';
import { Data } from '../classes/data';
import { ControlTypeEnum } from '..';
// import { BrowserButtonTypeEnum, BrowserNavigationService } from '../../views/services/browser-navigation.service';
import { CookieService } from 'ngx-cookie-service';
import { BaseService } from './base.service';
// import { DialogService } from '../../views/services/dialog.service';
// import { LoadingService } from '../../views';
import { SettingsService } from './settings.service';
import { BrowserButtonTypeEnum, BrowserNavigationService, DialogService, LoadingService } from 'src/app/views';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoreService extends BaseService {

  renderPage$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  closePage$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  disconnect$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  clearLayout$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  searchData$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  searchLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  notifications$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  relatedSelectedRows: any;
  closePageMsg = false;

  constructor(
    public override messageService: MessageService,
    public webSocket: WebSocketService,
    public override dataService: DataService,
    private dialogService: DialogService,
    private browserNavigation: BrowserNavigationService,
    private loadingService: LoadingService,
    private appSettings: SettingsService,
    private cookieService: CookieService,
    private router: Router) {
      super(dataService, messageService);

  }

  connect() {
    this.webSocket.connect().pipe(
			).subscribe(msg => this.elaborate(msg));
  }

  //#region Received messages elaboration
  elaborate(newMessage: any) {
		switch (newMessage.type) {

      case MessageTypeEnum.Exception: {
        this.handleException(newMessage);

        break;
			}

			case MessageTypeEnum.Response: {

        // RECEIVE DATA: CHECK CORRESPONDING INVOKE TO KNOW WHAT I ASKED FOR
        const relatedInvoke = this.getRelatedInvoke();

        if (relatedInvoke) {

          if (relatedInvoke.arguments.method !== undefined) {

            if (newMessage?.value) {

              switch (relatedInvoke.arguments.method) {

                case MessageMethodEnum.Validate: {
                  const newData = this.dataService.contentData[relatedInvoke.objectid];

                  const index = this.getContentDataIndex();

                  newData.dataSet[index] = newMessage.value.datarow;
                  newData.formattedDataSet[index] = newMessage.value.fdatarow;

                  // this.dataService.contentData[relatedInvoke.objectid] = newData;
                  this.dataService.contentData$[relatedInvoke.objectid].next(newData);
                  this.dataService.contentDataSbj$.next(this.dataService.contentData);

                  break;
                }

                case MessageMethodEnum.GetRelated: {
                  let dropDownData: Data;

                  // Update data
                  if (this.dataService.contentDropDownData[relatedInvoke.arguments.controlid]) {
                    dropDownData = this.dataService.contentDropDownData[relatedInvoke.arguments.controlid];
                  }
                  // New data
                  else
                    dropDownData = new Data();

                  // Append new items
                  if (dropDownData.dataSet && dropDownData.dataSetLength > 0) {
                    if (dropDownData.dataSetLength >= newMessage.value.count && dropDownData.newDataSet) {

                      // Filtering data writing into the dropdown, dataset will be override
                      dropDownData.dataSet = newMessage.value.dataset;
                      dropDownData.formattedDataSet = newMessage.value.fdataset;
                    }
                    else if (dropDownData.dataSet.length < dropDownData.dataSetLength) {

                      // Add new data to previous ones
                      for (let i = 0; i < newMessage.value.dataset.length; ++i) {
                        dropDownData.dataSet.push(newMessage.value.dataset[i]);
                        dropDownData.formattedDataSet.push(newMessage.value.fdataset[i]);
                      }
                    }
                    else if (dropDownData.dataSetLength !== newMessage.value.count) {
                      // Refresh data if different than before
                      dropDownData.set(newMessage.value.dataset, newMessage.value.fdataset,
                        newMessage.value.schema, newMessage.value.count);
                    }
                  }
                  // Create new dataset
                  else {
                    dropDownData.set(newMessage.value.dataset, newMessage.value.fdataset,
                      newMessage.value.schema, newMessage.value.count);
                  }

                  this.dataService.contentDropDownData[relatedInvoke.arguments.controlid] = dropDownData;
                  // this.dataService.contentDropDownData$[relatedInvoke.objectid].next(dropDownData);
                  this.dataService.contentDropDownDataSbj$.next(this.dataService.contentDropDownData);

                  break;
                }
              }
            }
            // else
              // this.loadingService.stopLoading(false);
          }
          else {
            switch (relatedInvoke.method) {

              case MessageMethodEnum.SelectRows: {
                this.relatedSelectedRows = relatedInvoke.arguments.rows;

                break;
              }

              // Event before the page is closed
              case MessageMethodEnum.Close: {
                if (newMessage.value)
                  this.handleClose(relatedInvoke.objectid);
                else if (this.browserNavigation.getButtonPressed() !== BrowserButtonTypeEnum.None) {
                  this.browserNavigation.setButtonPressed(BrowserButtonTypeEnum.None);

                  if (this.browserNavigation.currentShowedPage) {
                    this.browserNavigation.addToHistory(this.browserNavigation.currentShowedPage);
                  }

                  this.browserNavigation.setTabTitle(this.browserNavigation.currentShowedPage);
                }

                break;
              }

              case MessageMethodEnum.Render: {
                this.handleRender(newMessage.value);
                break;
              }

              case MessageMethodEnum.UpdateNotifications: {
                this.handleUpdateNotifications(newMessage.value);
                break;
              }

              case MessageMethodEnum.GetData:
              default: {
                if (newMessage.value?.dataset != null) {

                  let receivedData: Data;
                  if (this.dataService.contentData[relatedInvoke.objectid] === undefined)
                    receivedData = new Data();
                  else
                    receivedData = this.dataService.contentData[relatedInvoke.objectid]

                  receivedData.dataSetLength = newMessage.value.count;
                  receivedData.dataSet = newMessage.value.dataset;
                  receivedData.formattedDataSet = newMessage.value.fdataset;

                  this.dataService.contentData[relatedInvoke.objectid] = receivedData;
                  this.dataService.contentData$[relatedInvoke.objectid].next(receivedData);

                  // contentDataSbj$ is a support data structure to manage some cases
                  this.dataService.contentDataSbj$.next(this.dataService.contentData);

                  this.dataService.resetPageSize();
                }
                else
                  this.loadingService.stopLoading();

                break;
              }
            }
          }
        }
        // }

        // Unlock invoke queue
        this.unblockInvokeQueue();

				break;
			}

			case MessageTypeEnum.Sendrecv: {
				this.handleSendRecv(newMessage);

				break;
			}

			case MessageTypeEnum.Send: {
        this.handleSend(newMessage);

        break;
      }
    }
  }

  handleSendRecv(result: any) {
    switch (result.value.action) {

      case MessageActionEnum.Confirm:
      case MessageActionEnum.Upload:{
        this.dialogService.openChooseDialog(result.value, result.relid);
        break;
      }

      case MessageActionEnum.Message: {
        result.value.recv = true;
        this.dialogService.openMessageDialog(result.value);
        break;
      }
    }
  }

  handleSend(result: any) {
    switch (result.value.action) {
      case MessageActionEnum.Message: {
        this.dialogService.openMessageDialog(result.value);
        break;
      }

      case MessageActionEnum.Page:
      case MessageActionEnum.Report: {
        // Clear all page data before changing page

        // TO CHECK
        // Se la pagina è di tipo modale non devo pulire (controllo check isModal)
        /*if (!result.value.ismodal)
          this.dataService.clearAll();*/

        this.handlePageSchema(result.value);

        // Check for subpages schema
        const pageControls = result.value.controls;

        const appCenter = pageControls.find((c: { type: ControlTypeEnum; }) => {
          return c.type === ControlTypeEnum.AppCenter;
        });

        let appContent;

        if (appCenter) {
          appContent = appCenter.controls.find((c: { type: ControlTypeEnum; }) => {
            return c.type === ControlTypeEnum.ContentArea;
          });

        } else {
          appContent = pageControls.find((c: { type: ControlTypeEnum; }) => {
            return c.type === ControlTypeEnum.ContentArea;
          });
        }

        if (appContent) {
          const appContentSubPages: any[] = appContent.controls.find((c: { type: ControlTypeEnum; }) => {
            return c.type === ControlTypeEnum.SubPage;
          });

          if (appContentSubPages) {
            appContent.controls.forEach((sp: { type: ControlTypeEnum; subpage: any; }) => {
              if (sp.type === ControlTypeEnum.SubPage)
                this.handlePageSchema(sp.subpage);
            });
          }
        }

        break;
      }

      /***
       * Refresh data in the current page
       */
      case MessageActionEnum.RefreshPage: {

        this.getData(result.value.pageid, // Message has the id of the page to refresh
          this.dataService.repeatersCurrentPage[result.value.pageid]*this.dataService.repeaterPageSize$.value,
          this.appSettings.getDataSetSize(), this.dataService.repeatersCurrentFilters[result.value.pageid]?.sort,
          this.dataService.repeatersCurrentFilters[result.value.pageid]?.search);

        break;
      }

      case MessageActionEnum.DeleteRows: {

        // Remove records from dataset
        const data = this.dataService.contentData[result.value.pageid].dataSet;
        const fdata = this.dataService.contentData[result.value.pageid].formattedDataSet;
        for (let i = result.value.rows.length - 1; i >= 0; i--) {
          data.splice(result.value.rows[i], 1);
          fdata.splice(result.value.rows[i], 1);
        }

        const newDataCount = this.dataService.contentData[result.value.pageid].dataSetLength - result.value.rows.length;

        const newData = this.dataService.contentData[result.value.pageid];
        newData.dataSetLength = newDataCount;

        this.dataService.repeaterPageSize$.next(data.length);

        this.dataService.contentData$[result.value.pageid].next(newData);

        break;
      }

      /***
       * Update the UI render of the current page
       */
      case MessageActionEnum.RenderPage: {
        this.render(result.value.pageid);

        break;
      }

      case MessageActionEnum.ClosePage: {
        this.closePageMsg = true;
        this.close(result.value.pageid);

        break;
      }

      case MessageActionEnum.Disconnect: {
        this.handleDisconnect();
        break;
      }

      /***
       * Update the notifications badge value
       */
      case MessageActionEnum.UpdateNotifications: {
        this.updateNotifications(this.appSettings.getStartPageId());

        break;
      }

      /**
       * Open file in a new tab of the browser
       */
      case MessageActionEnum.OpenFile: {
        this.openFile(result.value);
        break;
      }

      /**
       * Save file in download folder
       */
      case MessageActionEnum.SaveFile: {
        this.saveFile(result.value);
        break;
      }

      /**
       * Open file in a new tab of the browser
       */
       case MessageActionEnum.OpenLink: {
        this.openLink(result.value.url);
        break;
      }

      /**
       * Save file in download folder
       */
      case MessageActionEnum.LoadingStart: {
        this.loadingService.startLoading();
        break;
      }

      case MessageActionEnum.LoadingStop: {
        this.loadingService.stopLoading();
        break;
      }
    }
  }

  private handlePageSchema(page: any) {

    // Create dataset area in memory
    if (this.dataService.contentData$[page.id]?.value === undefined)
      this.dataService.contentData$[page.id] = new BehaviorSubject<Data>(new Data());

    let receivedData;

    if (this.dataService.contentData[page.id] === undefined)
      receivedData = new Data();
    else
      receivedData = this.dataService.contentData[page.id]

    if (page.schema && page.schema.length > 0) {
      receivedData.schema = page.schema;

      this.dataService.contentData[page.id] = receivedData;
      this.dataService.contentData$[page.id].next(receivedData);
    }
  }

  private handleRender(page: any) {
    if (page) {
      this.renderPage$.next(page);
    }
  }

  private handleClose(pageid: any) {

    let relatedSend;

    // Find the page to close (page id is relatedInvoke.objectid)
    if (this.messageService.sendPageQueue.getQueueLength() > 0) {
      relatedSend = this.messageService.sendPageQueue.getQueue().find(
        s => s.value.id === pageid
      );
    }

    if (relatedSend && relatedSend?.value) {
      this.closePage$.next( {page: relatedSend.value, closePageMsg: this.closePageMsg} );
      this.closePageMsg = false;
    }
  }

  private handleException(result: any) {
    if (result.title === undefined || result.title === '') {
      result.title = 'Attenzione!'
    }

    this.dialogService.openMessageDialog(result);

    // Exception received opening welcome page
    const relatedInvoke = this.getRelatedInvoke();
    if (relatedInvoke && relatedInvoke.type === MessageTypeEnum.Invoke &&
        relatedInvoke.method === MessageMethodEnum.RunTask &&
        relatedInvoke.classname === this.appSettings.getStartPage())
        this.handleDisconnect();

    // Unlock invoke queue
    this.unblockInvokeQueue();
  }

  private handleDisconnect() {
    this.webSocket.closeConnection();

    this.disconnect$.next(true);
    this.clearLayout$.next(true);

    // Remove cookie for logged user
    const cookie: boolean = this.cookieService.check('core-auth-token');
    if (cookie) {
      this.cookieService.delete('core-auth-token', '/');
    }

    this.appSettings.setAuthenticated(false);
    this.router.navigate(['/auth/login']);
  }
  //#endregion

  public getRelatedInvoke(): any {
    if (!this.messageService.invokeQueue.isEmpty()) {
      const relatedInvoke = this.messageService.invokeQueue.getFirst();

      if (relatedInvoke)
        return relatedInvoke;
      else
        return undefined;
    }
  }

  public unblockInvokeQueue() {
    if (!this.messageService.invokeQueue.isEmpty()) {

      this.messageService.invokeQueue.dequeue();

      if (this.messageService.invokeQueue.getQueueLength() >= 1) {
        const messageToSend = this.messageService.invokeQueue.getFirst();
        this.webSocket.send(messageToSend);
      }
    }
  }

  /**
   * Send message to Close Page
   */
   close(pageid: string) {
      this.browserNavigation.setLastClosedPageId(pageid);
      this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined, MessageMethodEnum.Close, {}, pageid);
  }

  /**
   * Send message to Render Page
   */
   render(pageid: string) {
    this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined, MessageMethodEnum.Render, {}, pageid);
  }

  getContentDataIndex(): number {
    let index = 0;

    // Need this to validate single cell value - Not checked if multirow selection
    if (this.relatedSelectedRows && this.relatedSelectedRows.length === 1) {
      index = this.relatedSelectedRows[0];
      // this.relatedSelectedRows = undefined;
    }

    return index;
  }

  clearTempData() {
    this.relatedSelectedRows = undefined;
  }

  //#region Notifications
  /**
   * Send message to Update Notifications
   */
  updateNotifications(pageid: string) {
    this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined, MessageMethodEnum.UpdateNotifications, {}, pageid);
  }

  /**
   * Handle the Update Notifications Event from server
   * @param value Notifications data
   */
  private handleUpdateNotifications(value: any) {
    this.notifications$.next(value);
  }
  //#endregion

  //#region File management
  private saveFile(file: any) {
    const downloadLink = document.createElement('a');
    downloadLink.href = file.mimedata + file.filedata;
    downloadLink.download = file.filename + '.' + file.fileextension;
    downloadLink.click();
  }

  private openFile(file: any) {
    const byteArray = new Uint8Array(atob(file.filedata).split('').map(char => char.charCodeAt(0)));
    const reportBlob = new Blob([byteArray], {type: file.mimetype});
    const url = window.URL.createObjectURL(reportBlob);
    window.open(url);
  }
  //#endregion

  //#region Open external link
  private openLink(url: string) {
    if (url && this.validURL(url)) {
      window.open(url);
    }
  }

  private validURL(str: string) {
    const pattern = new RegExp('((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)');
    return !!pattern.test(str);
  }
  //#endregion
}
