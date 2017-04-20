import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'my-app',
    template: `
    <div>
        <a href="/">home</a>
        <a href="/grid">grid</a>
    </div>
    <router-outlet></router-outlet>
    `
})
export class MyAppComponent {
    constructor() {
    }
}
