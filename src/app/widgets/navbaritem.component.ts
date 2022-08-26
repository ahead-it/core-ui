import { Component, ViewChild, ViewContainerRef, ComponentRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: '[navbaritem]',
  templateUrl: './navbaritem.component.html'
})
export class NavBarItemComponent {
    public caption: string = "";
    public items: ComponentRef<NavBarItemComponent>[] = [];
    public id: string = "";
    public level: number = 0;

    @ViewChild("body", { read: ViewContainerRef, static: true })
    private body!: ViewContainerRef;  

    @ViewChild("simple", { read: ViewContainerRef, static: true })
    private simple!: ViewContainerRef;  

    @ViewChild("dropdown", { read: ViewContainerRef, static: true })
    private dropdown!: ViewContainerRef;      

    @ViewChild("subArea0", { read: ViewContainerRef, static: false }) 
    private subArea0!: ViewContainerRef;  
    
    @ViewChild("subArea1", { read: ViewContainerRef, static: false }) 
    private subArea1!: ViewContainerRef;  

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
        else
          this.subArea1.insert(this.items[i].hostView);
      }
    }    

    public addItem(): ComponentRef<NavBarItemComponent> {
      const result = this.body.createComponent(NavBarItemComponent);
      result.instance.level = this.level + 1;
      result.hostView.detach();
      this.items.push(result);
      return result;
    }     
}
