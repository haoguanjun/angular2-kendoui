import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule, ButtonGroupModule, DropDownButtonModule, SplitButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';

import { MyAppComponent } from "./app.component";

@NgModule({
    declarations: [
        MyAppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        InputsModule,
        ButtonsModule, ButtonGroupModule, DropDownButtonModule, SplitButtonModule,
        GridModule
    ],
    bootstrap: [MyAppComponent]
})
export class AppModule {
}
