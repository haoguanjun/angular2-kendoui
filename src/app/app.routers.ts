import { Routes, RouterModule } from '@angular/router';
import { NgModule }     from '@angular/core';

import { MyAppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { GridSampleComponent } from './grid/grid.sample.component';

@NgModule({
	imports: [
		RouterModule.forRoot([
			{ path: '', component: HomeComponent},
            { path: 'grid', component: GridSampleComponent }
		])
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }

