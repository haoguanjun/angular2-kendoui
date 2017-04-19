import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'my-app',
    template: `
    <form>
        <fieldset>
            <div>
                <legend>Slider Component</legend>
                <div>
                    <kendo-slider></kendo-slider>
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
export class SliderSampleComponent {
    constructor() {
    }
}
