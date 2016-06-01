
import { Component } from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup, Control  } from '@angular/common';
import { KendoValueAccessor } from './kendo.angular2';

@Component({
    selector: 'my-app',
    template: `
    <form [ngFormModel]='myForm'>
    <button (click)="log()">log</button>
    <button (click)="setValue()">set value</button>
    <button (click)="setFormat()">set format</button>
    <div>
        <label>age:  </label>
    </div>
    <fieldset>
        <div>
            <legend>Web Component</legend>
            <label>[control] and [value]</label><kendo-numerictextbox [options]="numericOptions" ng-control="age" (spin)="log($event)" [(ngModel)]='data.age'></kendo-numerictextbox>
            <kendo-slider [options]="sliderOptions" ng-control="age" [(ngModel)]='data.age'></kendo-slider>
        </div>
    </fieldset>
    <button (click)="onLogin()">Login</button>
    </form>
    `,
    directives: [ FORM_DIRECTIVES, KendoValueAccessor ]
})
export class MyAppComponent {
    data: { age: Number } = { age: 10 };
    numericOptions: { format: String } = { format: "c0" };
    sliderOptions: { orientation: String } = { orientation: "horizontal" };

    theFormat: String;

    myForm: ControlGroup;

    constructor() {
        this.data.age = 10;

        this.myForm = new ControlGroup({
            fullName: new Control(""),
            username: new Control(""),
            age: new Control("")
        });

    }

    setFormat() {
        // WARNING: assigning value to the existing options object does not work yet.
        this.numericOptions = { format: "n0" };
        this.sliderOptions = { orientation: "vertical" };
    }

    log() {
        console.log(arguments);
    }

    setValue() {
        this.data.age = 7;
    }

    onLogin() {
        // alert(this.myForm.controls.age.value);
    }
}
