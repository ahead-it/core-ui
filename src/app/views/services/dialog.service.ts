import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { MessageActionEnum, MessageService, MessageTypeEnum } from '../../core';
import { Queue } from '../../core/classes/queue';
import { BaseService } from '../../core/services/base.service';
import { LoadingService } from './loading.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { DataService } from '../../core/services/data.service';
import { ConfirmDialogComponent, FileUploadDialogComponent, MessageDialogComponent } from '../dialogs';
import { DialogTypeEnum } from '..';

/**
 * Manage a queue to open dialogs in the correct order
 */
@Injectable()
export class DialogService extends BaseService {

    // Public properties
    dialogQueue = new Queue<any>(100);

    closeDialogPage$: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private dialog: MatDialog,
        public override messageService: MessageService,
        private webSocket: WebSocketService,
        public override dataService: DataService, private loadingService: LoadingService) {
            super(dataService, messageService);
    }

    //#region Dialogs
    openChooseDialog(valueMessage: { action: any; title: any; message: any; default: any; }, relid?: string): void {

        if (this.canOpenDialog()) {
            this.loadingService.stopLoading();

            let dialogRef;

            switch (valueMessage.action) {

                default:
                case MessageActionEnum.Confirm: {
                    dialogRef = this.dialog.open(ConfirmDialogComponent, {
                        width: '280px',
                        data: {title: valueMessage.title, message: valueMessage.message, cancelLabel: 'No', confirmLabel: 'Si',
                            default: valueMessage.default }
                    });
                    break;
                }

                case MessageActionEnum.Upload: {
                    dialogRef = this.dialog.open(FileUploadDialogComponent, {
                        width: '280px',
                        data: {title: valueMessage.title, message: valueMessage.message, cancelLabel: 'Annulla', confirmLabel: 'Scegli...',
                            default: valueMessage.default }
                    });
                    break;
                }
            }

            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    const msg = this.messageService.createWsAnswerMessage(result, relid);
                    this.webSocket.send(msg);

                    this.openNextDialog();
                }
            });
        } else {
            this.dialogQueue.enqueue(valueMessage);
        }
    }

    openMessageDialog(valueMessage: { title: any; message: any; recv?: any; }): void {

        if (this.canOpenDialog()) {
            this.loadingService.stopLoading();

            const dialogRef = this.dialog.open(MessageDialogComponent, {
                width: '280px',
                data: {title: valueMessage.title, message: valueMessage.message, zindex: 2000, retValue: valueMessage.recv }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {

                    const msg = this.messageService.createWsAnswerMessage(result);
                    this.webSocket.send(msg);
                }

                this.openNextDialog();
            });
        } else {
        this.dialogQueue.enqueue(valueMessage);
        }
    }

    openPageDialog(modalData: { title: any; pageId: any; controls: any; actionArea: any; parentPageId: string; }): void {
        /*if (this.canOpenDialog()) {
            const dialogRef = this.dialog.open(PageDialogComponent, {
                width: this.dialog.openDialogs.length === 0 ? '90vw' : (90 - 8*this.dialog.openDialogs.length).toString() + 'vw',
                // minHeight: '60vh',
                maxWidth: '95vw',
                maxHeight: '92vh',
                // panelClass: 'mat-dialog-override',
                data: {title: modalData.title, pageId: modalData.pageId, layout: modalData.controls, actionArea: modalData.actionArea }
            });

            dialogRef.afterClosed().subscribe(result => {

                if (result !== undefined) {
                    // DISMISSED: parent page data reloaded every time the dialog is closed and not only when details data are edited
                    // if (result.isEdited) {
                    this.update(modalData.parentPageId);
                    // }
                }

                this.openNextDialog();
            });
        } else {
            this.dialogQueue.enqueue(modalData);
        }*/
    }

    checkOpenedDialogs(): boolean {
        return this.dialog.openDialogs.length > 0;
    }

    getOpenedDialogType(): DialogTypeEnum {
        // if (this.dialog.openDialogs[this.dialog.openDialogs.length-1].componentInstance instanceof PageDialogComponent)
            // return DialogTypeEnum.Page;

        if (this.dialog.openDialogs[this.dialog.openDialogs.length-1].componentInstance instanceof ConfirmDialogComponent)
            return DialogTypeEnum.Confirm;

        return DialogTypeEnum.Message;
    }

    getOpenedDialogPage() { // : PageDialogComponent {
        /*if (this.checkOpenedDialogs())
            return this.dialog.openDialogs[this.dialog.openDialogs.length-1].componentInstance as PageDialogComponent;*/

        return undefined;
    }

    closeDialog() {
        if (this.checkOpenedDialogs())
            this.dialog.closeAll();
    }

    public closeDialogPage(pageId: any) {
        this.closeDialogPage$.next({ value: true, pageId });
      }

    /***
     * Check if can open current dialog
     */
    private canOpenDialog(): boolean {
        return this.dialog.openDialogs.length === 0;
        /*return (this.dialog.openDialogs.length === 0 ||
        (this.dialog.openDialogs.length > 0 &&
            this.dialog.openDialogs[this.dialog.openDialogs.length-1].componentInstance instanceof PageDialogComponent));*/
    }

    /***
     * Open latest dialog in queue
     */
    private openNextDialog() {
        if (this.dialogQueue.getQueueLength() > 0) {
            const message = this.dialogQueue.dequeue();

            switch (message.action) {
                case MessageActionEnum.Confirm:
                case MessageActionEnum.Upload: {
                    this.openChooseDialog(message);
                    break;
                }

                case MessageActionEnum.Message: {
                    this.openMessageDialog(message);
                    break;
                }

                // default:
                case MessageActionEnum.Page:
                case MessageActionEnum.Report: {
                    this.openPageDialog(message);
                    break;
                }
            }
        }
    }
    //#endregion
}

