import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule, ButtonGroupModule, DropDownButtonModule, SplitButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';

import { MyAppComponent } from "./app.component";
import { HomeComponent } from './home.component';
import { GridSampleModule } from './grid/grid.sample.module';
import { AppRoutingModule } from './app.routers';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule,
        AppRoutingModule,
        GridSampleModule,
        InputsModule,
        ButtonsModule, ButtonGroupModule, DropDownButtonModule, SplitButtonModule,
        GridModule
    ],
    declarations: [
        MyAppComponent,
        HomeComponent
    ],
    providers: [
         
    ],
    bootstrap: [MyAppComponent]
})
export class AppModule {
}
