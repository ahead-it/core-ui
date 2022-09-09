import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreService, WebSocketService } from 'src/app/core';
import { BrowserNavigationService, LayoutService } from '../..';

@Component({
  selector: '[base]',
  templateUrl: './base.component.html'
})
export class BaseComponent implements OnInit {
  public collapsed = false;
  private hashFragment!: string;

  constructor(private activatedRoute: ActivatedRoute, 
    protected layoutService: LayoutService, private webSocket: WebSocketService, private core: CoreService, 
    private browserNavigation: BrowserNavigationService) {

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
