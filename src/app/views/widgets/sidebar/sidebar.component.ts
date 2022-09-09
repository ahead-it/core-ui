import { AfterContentInit, Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { BaseUIComponent } from '..';
import { SideBarItemComponent } from './sidebaritem.component';

@Component({
  selector: '[sidebar]',
  templateUrl: './sidebar.component.html'
})
export class SideBarComponent extends BaseUIComponent implements AfterContentInit {

  public items: ComponentRef<SideBarItemComponent>[] = [];
  public id: string = "";

  @ViewChild("mainArea", { read: ViewContainerRef, static: true })
  private mainArea!: ViewContainerRef;

  override ngOnInit() {
    this.id = crypto.randomUUID();
    this.layoutService.sideBar$.subscribe(
      sidebar => {
        this.loadItems(sidebar.controls);
      });
  }

  ngAfterContentInit() {
    for (var i = 0; i < this.items.length; i++) {
      this.mainArea.insert(this.items[i].hostView);
    }
  }

  public addItem(): ComponentRef<SideBarItemComponent> {
    const result = this.mainArea.createComponent(SideBarItemComponent);
    result.instance.level = 0;
    result.hostView.detach();
    this.items.push(result);
    return result;
  }

  /**
   * Load SideBar Items
   */
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
