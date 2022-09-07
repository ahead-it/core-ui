import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { LogoTypeEnum, SettingsService } from './core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ViewsModule } from './views/views.module';
import { CookieService } from 'ngx-cookie-service';

// Auth
import { AuthModule } from './views/auth/auth.module';

export function initializeSettings(appSettings: SettingsService, titleService: Title ) {
  return () => {
    appSettings.initConfig().subscribe(
      res => {
        appSettings.settings$.next(res);
        appSettings.configLoaded = true;
        appSettings.getLogo(LogoTypeEnum.Standard).subscribe(
            logo => appSettings.createImageFromBlob(logo, 'logo')
        );
        
      appSettings.getLogo(LogoTypeEnum.Small).subscribe(
        logo => appSettings.createImageFromBlob(logo, 'logo_small')
          );
          
      appSettings.getIcon().subscribe(
        icon => {
          appSettings.createImageFromBlob(icon, 'icon');      
        });

      appSettings.getBackground().subscribe(
          bg => appSettings.createImageFromBlob(bg, 'background')
        );

      // Set document title
      titleService.setTitle(res.name);

      appSettings.icon$.subscribe(
        icon => appSettings.setAppFavicon() // Set document favicon
        )
      }
    );
  };
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ViewsModule,
    CoreModule,
    AuthModule.forRoot()
  ],
  providers: [
    CookieService,
    {
      // settings initializer
      provide: APP_INITIALIZER,
      useFactory: initializeSettings,
      deps: [SettingsService, Title], multi: true
}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
