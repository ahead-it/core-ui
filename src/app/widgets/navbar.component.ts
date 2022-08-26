import { Component, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';

import { NavBarItemComponent } from './navbaritem.component';

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.component.html'
})
export class NavBarComponent {
  public items: ComponentRef<NavBarItemComponent>[] = [];
  public id: string = "";

  @ViewChild("leftArea", { read: ViewContainerRef, static: true })
  private leftArea!: ViewContainerRef;
  
  @ViewChild("body", { read: ViewContainerRef, static: true })
  private body!: ViewContainerRef;

  private ngOnInit() {
    this.id = crypto.randomUUID();
  }

  private ngAfterContentInit() {
    for (var i = 0; i < this.items.length; i++) {
      this.leftArea.insert(this.items[i].hostView);
    }
  }
   
  public addItem(): ComponentRef<NavBarItemComponent> {
    const result = this.leftArea.createComponent(NavBarItemComponent);
    result.instance.level = 0;
    result.hostView.detach();
    this.items.push(result);
    return result;
  }  
}
