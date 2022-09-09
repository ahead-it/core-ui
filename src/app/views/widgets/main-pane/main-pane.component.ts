import { Component } from '@angular/core';
import { ViewChild, ViewContainerRef } from '@angular/core';
import { BaseComponent, NavBarComponent, SideBarComponent } from '..';

@Component({
  selector: '[contentarea]',
  templateUrl: './main-pane.component.html'
})
export class MainPaneComponent extends BaseComponent {
  title = 'core-ui';

  @ViewChild("body", { read: ViewContainerRef, static: true })
  body!: ViewContainerRef;

  override ngOnInit() {
    this.body.clear();
    
    //#region Display properties subjects subscriptions
    this.layoutService.sideBarDisplay$.subscribe(sidebarDisplay => {
      if (sidebarDisplay) {
        this.body.createComponent(SideBarComponent);
      }
    });

    this.layoutService.navBarDisplay$.subscribe(navbarDisplay => {
      if (navbarDisplay) {
        this.body.createComponent(NavBarComponent);
      }
    });
    //#endregion
  }

}
