import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'my-app',
    template: `
    <form>
        <fieldset>
            <div>
                <legend>Numeric Textbox Component</legend>
                <div>
                    <kendo-numerictextbox ></kendo-numerictextbox>
                </div>
                <div>                    
                </div>
            </div>
        </fieldset>
        <button kendoButton >Login</button>
    </form>
    <router-outlet></router-outlet>
    `
})
export class NumericTextboxSampleComponent {
    constructor() {
    }
}
