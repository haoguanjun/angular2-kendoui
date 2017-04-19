import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule,  Http, Jsonp, JsonpModule } from '@angular/http';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule, ButtonGroupModule, DropDownButtonModule, SplitButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';

import { GridSampleComponent } from "./grid.sample.component";
import { EditService, MyEditService } from './edit.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule, JsonpModule,
        GridModule
    ],
    declarations: [
        GridSampleComponent
    ],
    providers: [
        {
            provide: EditService,
            deps: [Jsonp],
            useFactory: (jsonp: Jsonp) => () => new EditService(jsonp)
        },
        MyEditService
    ],
    exports: [
        GridSampleComponent
    ]
})
export class GridSampleModule {
}
