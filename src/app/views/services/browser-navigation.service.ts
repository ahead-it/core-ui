import { Injectable } from '@angular/core';
import { MessageMethodEnum, MessageService, MessageTypeEnum, PageStack, SettingsService } from '../../core';
import { BaseService } from '../../core/services/base.service';
import { Title } from '@angular/platform-browser';
import { DialogService } from './dialog.service';
import { DataService } from '../../core/services/data.service';

@Injectable()
export class BrowserNavigationService extends BaseService {

    browserButtonPressed = BrowserButtonTypeEnum.None;
    previousShowedPage: any;
    currentShowedPage: any;
    lastClosedPageId: any;
    showedPagesStack = new PageStack(1000);

    constructor(
        public override dataService: DataService,
        public override messageService: MessageService,
        public appSettings: SettingsService,
        private titleService: Title,
        private dialogService: DialogService) {
            super(dataService, messageService);
    }

    setCurrentPage(page: any) {
        this.currentShowedPage = page;
    }

    updateShowedPage(page: any) {
        let navigationId = 0;
        if (this.showedPagesStack.length === 0)
            navigationId = 1;
        else
            navigationId = this.showedPagesStack.getLast().navigationid+1;

        page.navigationid = navigationId;

        if (this.currentShowedPage) {
            this.previousShowedPage = this.currentShowedPage;
        }

        const pageInStack = this.showedPagesStack.getByClassName(page.classname);

        // Page already in stack: update the id with the new one but don't push the new page into the stack
        if (pageInStack)
            pageInStack.id = page.id;
        else
            this.showedPagesStack.push(page);

        this.setCurrentPage(page);
        this.setTabTitle(this.currentShowedPage);
    }

    restorePreviousPage(setTitle = true, resetButton = true) {
        this.previousShowedPage = this.currentShowedPage;

        const page = this.decodeHashFragment();

        if (page)
            this.setCurrentPage(this.showedPagesStack.getByClassName(page.pagename));
        else {
            this.setCurrentPage(this.showedPagesStack.getFirst());
        }

        if (setTitle)
            this.setTabTitle(this.currentShowedPage);
        else
            this.setDefaultTabTitle();

        if (resetButton && this.getButtonPressed() !== BrowserButtonTypeEnum.None) {
            this.setButtonPressed(BrowserButtonTypeEnum.None);
          }
    }

    setLastClosedPageId(pageId: any) {
        this.lastClosedPageId = pageId;
    }

    currentPageAlreadyClosed() {
        if (!this.lastClosedPageId)
            return false;

        return this.lastClosedPageId === this.currentShowedPage.id;
    }

    /***
     * Avoid to reload and elaborate the same page.
     */
    canNavigate(pageid: any): boolean {
        if (this.currentShowedPage !== undefined &&
            this.currentShowedPage.id === pageid)
            return false;

        return true;
    }

    addToHistory(page: any) {
        if (this.getButtonPressed() !== BrowserButtonTypeEnum.None)
        {
            this.setButtonPressed(BrowserButtonTypeEnum.None);
            return;
        }

        if (!this.previousShowedPage || this.previousShowedPage?.classname === page.classname)
            return;

        let hashFragment = '';
        if (!this.isStartPage(page))
            hashFragment = this.encodeHashFragment(this.createHashFragmentObj(page));

        history.pushState(hashFragment, '', hashFragment !== '' ? '#' + hashFragment : '');
    }

    goBack() {
        history.back();
    }

    /***
     * Set the title of the current browser tab.
     *
     * @param page The page to show in the title
     */
    setTabTitle(page: any) {

        if (!page) {
            this.setDefaultTabTitle();
            return;
        }

        let title = '';

        if(page.caption === '')
            title = this.appSettings.getAppName();
        else {
            title += page.caption;

            if (this.appSettings.getAppName() !== '') {
                title += ' - ' + this.appSettings.getAppName();
            }
        }

        this.titleService.setTitle(title);
    }

    /**
     * Restore the default browser tab title.
     */
    setDefaultTabTitle() {
        this.titleService.setTitle(this.appSettings.getAppName());
    }

    replaceHistory() {
        this.setTabTitle(this.currentShowedPage);
        const hashFragment = this.encodeHashFragment(this.createHashFragmentObj(this.currentShowedPage));

        if (history.state !== hashFragment)
            history.pushState(hashFragment, '', '#' + hashFragment);
    }

    /**
     * Navigate to Page
     */
    navigateToPage() {

        // Deserialize hash fragment
        const hashFragmentObj = this.decodeHashFragment();

        if (hashFragmentObj !== null) {
            this.messageService.createWsMessage(MessageTypeEnum.Invoke, 'app.' +
                hashFragmentObj.pageaction + '.' + hashFragmentObj.pagename,
                    MessageMethodEnum.RunTask, { });
        }
        else {
            this.messageService.createWsMessage(MessageTypeEnum.Invoke, this.appSettings.getStartPage(),
                MessageMethodEnum.RunTask, { });
        }
    }

    private createHashFragmentObj(page: any): any {
        const obj: any = {
            navigationid: page.navigationid,
            pagename: page.classname,
            pageaction: page.action // page - report
        };

        return obj;
    }

    encodeHashFragment(obj: any): string {
        const objJsonStr = JSON.stringify(obj);
        return btoa(objJsonStr);
    }

    getHashFragment(): string {
        if (window.location.hash !== '')
            return window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;

        return '';
    }

    decodeHashFragment(): any {
        const hashFragment = this.getHashFragment();

        if (hashFragment !== '') {
            const encodedHashFragment = atob(this.getHashFragment());
            return JSON.parse(encodedHashFragment);
        }
        else
            return null;
    }

    checkButtonPressed(): BrowserButtonTypeEnum {
        const page = this.decodeHashFragment();
        if (!page || page?.navigationid <= this.currentShowedPage.navigationid)
            this.setButtonPressed(BrowserButtonTypeEnum.Back);
        else
            this.setButtonPressed(BrowserButtonTypeEnum.Forward);

        return this.getButtonPressed();
    }

    getButtonPressed() {
        return this.browserButtonPressed;
    }

    setButtonPressed(value: BrowserButtonTypeEnum) {
        this.browserButtonPressed = value;
    }

    clearAll() {
        this.setDefaultTabTitle();
        this.browserButtonPressed = BrowserButtonTypeEnum.None;
        this.previousShowedPage = undefined;
        this.setCurrentPage(undefined);
        this.showedPagesStack.clear();
    }

    functionNotAvailableMsg() {
        const msg = { title: 'Attenzione!', message: 'Funzionalità non disponibile.'};
        this.dialogService.openMessageDialog(msg);
    }

    /**
     * Check if browser navigation through pages is enabled .
     * If False, skips the browser navigation and shows a message.
     */
    navigationEnabled(): boolean {
        return this.appSettings.navigationEnabled();
    }

    isStartPage(page: { classname: string; }): boolean {
        return this.appSettings.getStartPage() === 'app.page.' + page.classname;
    }
}

export enum BrowserButtonTypeEnum {
    None = 'none',
    Back = 'back',
    Forward = 'forward',
    Other = 'other'
}