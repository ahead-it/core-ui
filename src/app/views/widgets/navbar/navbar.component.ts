import { Component, ViewChild, ViewContainerRef, ComponentRef, AfterContentInit } from '@angular/core';
import { BaseUIComponent } from '..';
import { NavBarItemComponent } from './navbaritem.component';

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.component.html'
})
export class NavBarComponent extends BaseUIComponent implements AfterContentInit {

  public items: ComponentRef<NavBarItemComponent>[] = [];

  @ViewChild("leftArea", { read: ViewContainerRef, static: true })
  private leftArea!: ViewContainerRef;

  @ViewChild("body", { read: ViewContainerRef, static: true })
  private body!: ViewContainerRef;

  override ngOnInit() {

    this.layoutService.navBar$.subscribe(
      navbar => {
        this.id = navbar.id;
        this.loadItems(navbar.controls);
      });
  }

  ngAfterContentInit() {
    for (var i = 0; i < this.items.length; i++) {
      this.leftArea.insert(this.items[i].hostView);
    }
  }

  public addItem(): ComponentRef<NavBarItemComponent> { //item: NavBarItemComponent
    const result = this.leftArea.createComponent(NavBarItemComponent);
    result.instance.level = 0;
    result.hostView.detach();
    this.items.push(result);
    return result;
  }

  loadItems(controls: any) {
    if (controls && controls.length > 0) {
      controls.forEach((control: any) => {
        let i = this.addItem();
        i.instance.assignValues(i, control);

        if (control.controls && control.controls.length > 0)
          i.instance.loadItems(control.controls);
      });
    }
  }
}
