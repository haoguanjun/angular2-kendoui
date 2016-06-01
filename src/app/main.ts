import "es6-shim";
import "es6-promise";
import "reflect-metadata";
import "rxjs";

import "jquery";
import "kendoui";
import "zone.js/dist/zone";

// import 'tether';
// import 'bootstrap';

import { bootstrap } from '@angular/platform-browser-dynamic';
import { MyAppComponent } from './app';

bootstrap( MyAppComponent );