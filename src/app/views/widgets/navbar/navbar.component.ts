import { Component, ViewChild, ViewContainerRef, ComponentRef, AfterContentInit } from '@angular/core';
import { BaseUIComponent } from '..';

import { NavBarItemComponent } from './navbaritem.component';

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.component.html'
})
export class NavBarComponent extends BaseUIComponent implements AfterContentInit {

  public items: ComponentRef<NavBarItemComponent>[] = [];
  public id: string = "";

  @ViewChild("leftArea", { read: ViewContainerRef, static: true })
  private leftArea!: ViewContainerRef;

  @ViewChild("body", { read: ViewContainerRef, static: true })
  private body!: ViewContainerRef;

  override ngOnInit() {
    this.id = crypto.randomUUID();

    this.layoutService.navBar$.subscribe(
      navbar => {
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

    /*
    const result = this.leftArea.createComponent(NavBarItemComponent);
    // result.instance.level = 0;
    result.hostView.detach();

    // Set component properties
    result.instance.level = 0;
    result.instance.caption = item.caption;  

    if (!this.utils.isEmptyObject(item.items) && item.items.length > 0) {
      // item.submenu = item.controls;
      result.instance.items = item.items;

      item.items.forEach(innerItem => {
        var inner = result.instance.addItem();
      });
    }

    this.items.push(result);

    // var sb1 = mn1.instance.addItem();
    // sb1.instance.caption = "Sub menu 1";


    return result;*/
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

  /**
   * Load NavBar Items
   */
  loadItems_old() {
    this.layoutService.navBar$.subscribe(
      navbar => {
        // let navbarItems: any[] = navbar.controls;
        // let navbarItems = this.mapControls(navbar.controls);

        if (navbar.controls && navbar.controls.length > 0) {
          navbar.controls.forEach((control: any) => {
            // this.createLayoutItem(item, 0);
            let i = this.addItem();
            // this.assignValues(i, control);
            i.instance.caption = control.caption;

            control.controls.forEach((innerItem: any) => {
              let ii = i.instance.addItem();
              ii.instance.caption = innerItem.caption;
            });

            /*if (i.instance.items.length > 0) {
              let ii = i.instance.items[0].instance.addItem();
              ii.instance.caption = i.instance.items[0].instance.caption;
            }*/

            
            /*i.instance.items.forEach(innerItem => {
              let ii = innerItem.addItem();
              ii.instance.caption = innerItem.instance.caption;
            });*/
          });
        }
      }
    );
  }

  /*private assignValues(i: ComponentRef<NavBarItemComponent>, control: any) {
    i.instance.caption = control.caption;
  }*/

  /*
  private mapControls(controls: any): NavBarItemComponent[] {
    let navbarItems: NavBarItemComponent[] = [];

    // CAPIRE SE SI PUO' FARE RICORSIVA
    navbarItems = controls.map((item: any) => {
      return {
        ...item,
        items: item.controls
      }
    });

    return navbarItems;
  }
  */
}
