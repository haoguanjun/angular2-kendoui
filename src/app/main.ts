import "./polyfill";
import "@progress/kendo-theme-default/dist/all.css";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
