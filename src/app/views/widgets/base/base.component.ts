import { Component, OnInit } from '@angular/core';
import { AppInjector, CoreService, DataService, MessageService, SettingsService, WebSocketService } from 'src/app/core';
import { BrowserNavigationService } from '../../services/browser-navigation.service';

@Component({
  selector: '[base]',
  templateUrl: './base.component.html'
})
export class BaseComponent implements OnInit {

  public messageService!: MessageService;
  public webSocket!: WebSocketService;
  // public layoutService: LayoutService;
  // public contentAreaLayout: ContentAreaLayoutService;
  // public utils: ObjectUtilsService;
  public dataService!: DataService;
  // public uiActions: UIActionsService;
  public appSettings!: SettingsService;
  public browserNavigation!: BrowserNavigationService;
  public core!: CoreService;
  // public spinner: NgxSpinnerService;
  // public loadingService: LoadingService;

  public collapsed = false;

  constructor() {
    // Manually retrieve the dependencies from the injector
    // so that constructor has no dependencies that must be passed in from child
    const injector = AppInjector.getInjector();

    if (injector !== undefined) {
        this.messageService = injector.get(MessageService);
        this.webSocket = injector.get(WebSocketService);
        this.appSettings = injector.get(SettingsService);
        this.core = injector.get(CoreService);
        // this.layoutService = injector.get(LayoutService);
        // this.utils = injector.get(ObjectUtilsService);
        // this.contentAreaLayout = injector.get(ContentAreaLayoutService);
        this.dataService = injector.get(DataService);
        // this.uiActions = injector.get(UIActionsService);
        this.browserNavigation = injector.get(BrowserNavigationService);
        // this.spinner = injector.get(NgxSpinnerService);
        // this.loadingService = injector.get(LoadingService);
    }
  }

  ngOnInit() {
    // Services connections
    if (!this.webSocket.connection$ || this.webSocket.connection$.closed) {
      // this.layoutService.connect();
      // this.contentAreaLayout.connect();
      this.core.connect();
    }
  }

}
