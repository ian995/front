import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './app/app.browser.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';

if (environment.production) {
  enableProdMode();
}

//platformBrowserDynamic().bootstrapModule(AppBrowserModule);

document.addEventListener('DOMContentLoaded', () => {
  const bootstrap = () =>
    platformBrowserDynamic().bootstrapModule(AppBrowserModule);

  if (environment.hmr) {
    if (module['hot']) {
      hmrBootstrap(module, bootstrap);
    } else {
      console.error('HMR is not enabled for webpack-dev-server!');
      console.log('Are you using the --hmr flag for ng serve?');
    }
  } else {
    bootstrap().catch(err => console.log(err));
  }
});
