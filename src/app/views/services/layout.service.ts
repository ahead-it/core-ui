import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SettingsService, MessageTypeEnum, MessageMethodEnum, 
  ControlTypeEnum, MessageService, MessageActionEnum, ActionAreaCategoryEnum, ObjectUtilsService } from '../../core';
import { CoreService } from '../../core/services/core.service';
import { BaseService } from '../../core/services/base.service';
import { LoadingService, LoadingTypeEnum } from './loading.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { DialogService } from './dialog.service';
import { DataService } from '../../core/services/data.service';
import { IconEnum } from '..';

@Injectable()
export class LayoutService extends BaseService {

    // Public properties
    sideBar$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    navBar$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    search$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    userCenter$: BehaviorSubject<any> = new BehaviorSubject<any>({});

    desktopHeaderDisplay$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    sideBarDisplay$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    navBarDisplay$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(public override messageService: MessageService, private webSocket: WebSocketService,
                private appSettings: SettingsService, private core: CoreService,
                public override dataService: DataService, private loadingService: LoadingService, private dialogService: DialogService,
                private utils: ObjectUtilsService) {
                  super(dataService, messageService);

        //#region Core subjects subscriptions
        this.core.clearLayout$.subscribe(res => {
          if (res) {
            this.clear();
          }
        });
        //#endregion
    }

    public connect() {
      this.webSocket.connect().pipe(
        ).subscribe(msg => this.elaborate(msg));
    }

    /**
     * Load app center
     */
    loadStartPage() {

      this.loadingService.startLoading(LoadingTypeEnum.Data);
      this.messageService.createWsMessage(MessageTypeEnum.Invoke, this.appSettings.getStartPage(),
        MessageMethodEnum.RunTask, { });
    }

    private elaborate(newMessage: any)
	  {
        if (newMessage.type === MessageTypeEnum.Send) {
            if (newMessage.value &&
              (newMessage.value.action === MessageActionEnum.Page || newMessage.value.action === MessageActionEnum.Report)) {

              const pageControls = newMessage.value.controls;

              const appCenter = pageControls.find((c: any) => {
                return c.type === ControlTypeEnum.AppCenter;
              });

              if (appCenter) {

                this.dialogService.closeDialog();

                this.appSettings.setStartPageId(newMessage.value.id);

                const sideBar = appCenter.controls.find((c: any) => {
                  return c.type === ControlTypeEnum.NavigationPane;
                });

                if (!this.utils.isEmptyObject(sideBar)) {
                  this.sideBarDisplay$.next(true);
                  this.sideBar$.next(sideBar);
                }

                const navBar = appCenter.controls.find((c: any) => {
                  return c.type === ControlTypeEnum.ActionArea;
                });

                if (!this.utils.isEmptyObject(navBar)) {
                  this.navBarDisplay$.next(true);
                  this.navBar$.next(navBar);
                }

                const search = appCenter.controls.find((c: any) => {
                  return c.type === ControlTypeEnum.Search;
                });

                if (!this.utils.isEmptyObject(search)) {
                  this.search$.next(search);
                }

                const notifications = appCenter.controls.find((c: any) => {
                  return c.type === ControlTypeEnum.Notification;
                });

                if (!this.utils.isEmptyObject(notifications)) {
                  this.core.notifications$.next(notifications);
                }

                const userCenter = appCenter.controls.find((c: any) => {
                  return c.type === ControlTypeEnum.UserCenter;
                });

                if (!this.utils.isEmptyObject(userCenter)) {
                  this.userCenter$.next(userCenter);
                }

                if (!this.utils.isEmptyObject(appCenter) ||
                    !this.utils.isEmptyObject(search) ||
                    !this.utils.isEmptyObject(notifications) ||
                    !this.utils.isEmptyObject(userCenter)) {
                  this.desktopHeaderDisplay$.next(true);
                }
              }

              /*const contentArea = pageControls.find((c) => {
                return c.type === ControlTypeEnum.ContentArea;
              });

              if (contentArea) {
                if (newMessage.value.caption && newMessage.value.caption !== '') {
                  this.subheaderDisplay$.next(true);
                  this.subheaderTitle$.next(newMessage.value.caption);
                  // this.subheaderDisplay$.next(subHeader);
                }
              }*/
            }
        }
    }

    /**
     * Clear all behaviour subject properties
     */
    public clear() {
      this.appSettings.setStartPageId('');

      this.sideBar$.next({});
      this.navBar$.next({});
      this.search$.next({});
      this.core.notifications$.next({});
      this.userCenter$.next({});

      this.desktopHeaderDisplay$.next(false);
      this.navBarDisplay$.next(false);
    }

    /**
     * Resolve icon based of code get from server
     * @param icon icon code
     */
    resolveIcon(icon: string) {
      switch(icon) {

        case IconEnum.Data:
          return 'fas fa-list';

        case IconEnum.Delete:
          return 'fas fa-trash-alt';

        case IconEnum.Edit:
          return 'fas fa-edit';

        case IconEnum.Home:
          return 'fas fa-home';

        case IconEnum.Info:
          return 'fas fa-info-circle';

        case IconEnum.Key:
          return 'fas fa-key';

        case IconEnum.New:
          return 'fas fa-plus';

        case IconEnum.Refresh:
          return 'fas fa-sync';

        case IconEnum.System:
          return 'fas fa-laptop';

        case IconEnum.Settings:
          return 'fas fa-cog';

        case IconEnum.User:
          return 'fas fa-user';

        case IconEnum.Export:
          return 'fas fa-file-export'

        case IconEnum.Generate:
          return 'fas fa-magic';

        case IconEnum.QrCode:
          return 'fas fa-qrcode';

        case IconEnum.Send:
          return 'fas fa-paper-plane';

        case IconEnum.Action:
          return 'fas fa-bolt';

        case IconEnum.Notifications:
          return 'fas fa-bell';

        case IconEnum.Search:
          return 'fas fa-search';

        case IconEnum.Save:
          return 'fas fa-save';

        case IconEnum.OpenFile:
          return 'fas fa-envelope-open-text';

        case IconEnum.OpenFolder:
          return 'fas fa-folder-open';

        case IconEnum.FilePDF:
          return 'fas fa-file-pdf';

        case IconEnum.FileExcel:
          return 'fas fa-file-excel';

        case IconEnum.FileCSV:
          return 'fas fa-file-csv';

        case IconEnum.Mobile:
          return 'fas fa-mobile-alt';

        case IconEnum.Play:
          return 'fas fa-play';

        case IconEnum.Pause:
          return 'fas fa-pause';

        case IconEnum.Stop:
          return 'fas fa-stop';

        case IconEnum.Upload:
          return 'fas fa-upload';

        case IconEnum.Attach:
          return 'fas fa-paperclip';

        case IconEnum.OpenLink:
          return 'fas fa-external-link-alt';

        default:
          return '';
      }
    }

    resolveActionCategoryStyle(category: ActionAreaCategoryEnum, controlType: string): string {
      return controlType + '-' + this.resolveActionCategoryColor(category);
    }

    resolveActionCategoryColor(category: ActionAreaCategoryEnum): string {
      switch (category) {

        case ActionAreaCategoryEnum.Record:
          return 'warning';

        case ActionAreaCategoryEnum.Report:
          return 'danger';

        case ActionAreaCategoryEnum.Process:
          return 'success';

        default:
          return 'primary'
      }
    }
}

