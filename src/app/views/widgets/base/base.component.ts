import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { AppInjector, CoreService, DataService, MessageService, ObjectUtilsService, SettingsService, WebSocketService } from 'src/app/core';
import { BrowserNavigationService, LayoutService, LoadingService } from '../..';

@Component({
  selector: '[base]',
  templateUrl: './base.component.html'
})
export class BaseComponent implements OnInit {

  public messageService!: MessageService;
  public webSocket!: WebSocketService;
  public layoutService!: LayoutService;
  // public contentAreaLayout: ContentAreaLayoutService;
  public utils!: ObjectUtilsService;
  public dataService!: DataService;
  // public uiActions: UIActionsService;
  public appSettings!: SettingsService;
  public browserNavigation!: BrowserNavigationService;
  public core!: CoreService;
  public spinner!: NgxSpinnerService;
  public loadingService!: LoadingService;

  public collapsed = false;
  private hashFragment!: string;

  constructor(private activatedRoute: ActivatedRoute) {
    // Manually retrieve the dependencies from the injector
    // so that constructor has no dependencies that must be passed in from child
    const injector = AppInjector.getInjector();

    if (injector !== undefined) {
        this.messageService = injector.get(MessageService);
        this.webSocket = injector.get(WebSocketService);
        this.appSettings = injector.get(SettingsService);
        this.core = injector.get(CoreService);
        this.layoutService = injector.get(LayoutService);
        this.utils = injector.get(ObjectUtilsService);
        // this.contentAreaLayout = injector.get(ContentAreaLayoutService);
        this.dataService = injector.get(DataService);
        // this.uiActions = injector.get(UIActionsService);
        this.browserNavigation = injector.get(BrowserNavigationService);
        this.spinner = injector.get(NgxSpinnerService);
        this.loadingService = injector.get(LoadingService);
    }

    // Pulls token from url before the hash fragment is removed
     const routeFragment: Observable<string | null> = this.activatedRoute.fragment;
      routeFragment.subscribe(fragment => {
        if (fragment)  // !== null
          this.hashFragment = fragment;
      });
  }

  ngOnInit() {
    // Services connections
    if (!this.webSocket.connection$ || this.webSocket.connection$.closed) {
      this.layoutService.connect();
      // this.contentAreaLayout.connect();
      this.core.connect();
    }

    this.layoutService.loadStartPage();

    // Check fragment hash
    if (this.hashFragment && this.hashFragment !== '')
      this.browserNavigation.navigateToPage();
  }

}
