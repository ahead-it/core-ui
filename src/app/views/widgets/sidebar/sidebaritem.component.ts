import { Component, ViewChild, ViewContainerRef, ComponentRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: '[sidebaritem]',
  templateUrl: './sidebaritem.component.html'
})
export class SideBarItemComponent {

  //#endregion Properties
  public caption: string = "";
  public items: ComponentRef<SideBarItemComponent>[] = [];
  public id: string = "";
  public level: number = 0;
  //#endregion

  @ViewChild("body", { read: ViewContainerRef, static: true })
  private body!: ViewContainerRef;

  @ViewChild("simple", { read: ViewContainerRef, static: true })
  private simple!: ViewContainerRef;

  @ViewChild("dropdown", { read: ViewContainerRef, static: true })
  private dropdown!: ViewContainerRef;

  @ViewChild("subArea0", { read: ViewContainerRef, static: false })
  private subArea0!: ViewContainerRef;

  // @ViewChild("subArea1", { read: ViewContainerRef, static: false })
  // private subArea1!: ViewContainerRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  private ngOnInit() {
    this.id = crypto.randomUUID();
  }
  
  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges();

    for (var i = 0; i < this.items.length; i++) {
      if (this.level == 0)
        this.subArea0.insert(this.items[i].hostView);
      // else
        // this.subArea1.insert(this.items[i].hostView);
    }
  }

  public addItem(): ComponentRef<SideBarItemComponent> {
    const result = this.body.createComponent(SideBarItemComponent);
    result.instance.level = this.level + 1;
    result.hostView.detach();
    this.items.push(result);
    return result;
  }

  loadItems(controls: any) {
    if (controls && controls.length > 0) {
      controls.forEach((control: any) => {
        let i = this.addItem();
        this.assignValues(i, control);

        if (control.controls && control.controls.length > 0)
          i.instance.loadItems(control.controls);
      });
    }
  }

  assignValues(i: ComponentRef<SideBarItemComponent>, control: any) {
    i.instance.caption = control.caption;
    // i.instance.items = item.items;
  }
}