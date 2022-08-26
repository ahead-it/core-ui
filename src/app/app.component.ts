import { Component } from '@angular/core';
import { ViewChild, ViewContainerRef } from '@angular/core';
import { NavBarComponent } from './widgets/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'core-ui';

  @ViewChild("body", { read: ViewContainerRef, static: true })
  body!: ViewContainerRef;

  ngOnInit() {
    this.title = "zzzz";

    this.body.clear();
    
    const nb = this.body.createComponent(NavBarComponent);
    
    var mn1 = nb.instance.addItem();
    mn1.instance.caption = "Menu 1";

    var mn2 = nb.instance.addItem();
    mn2.instance.caption = "Menu 2";

    var sb1 = mn1.instance.addItem();
    sb1.instance.caption = "Sub menu 1";

    var ss1 = sb1.instance.addItem();
    ss1.instance.caption = "Sub sub menu 1";

    var sx1 = ss1.instance.addItem();
    sx1.instance.caption = "Sub sub sub menu 1";
  }

}
