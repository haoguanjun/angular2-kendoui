import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'my-app',
    template: `
    <form>
        <fieldset>
            <div>
                <legend>Web Component</legend>
                <div>
                    <kendo-numerictextbox ></kendo-numerictextbox>
                </div>
                <div>
                    <kendo-slider></kendo-slider>
                </div>
            </div>
        </fieldset>
        <button kendoButton >Login</button>
    </form>
    `
})
export class MyAppComponent {
    constructor() {
    }
}
