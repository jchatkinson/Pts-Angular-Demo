import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { Demo1Component } from './demo1/demo1.component';
import { Demo2Component } from './demo2/demo2.component';
import { HomeComponent } from './home/home.component';
import { Demo3Component } from './demo3/demo3.component';

const appRoutes: Routes = [
  { path: 'demo/1', component: Demo1Component},
  { path: 'demo/2', component: Demo2Component},
  { path: 'demo/3', component: Demo3Component},
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: HomeComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    Demo1Component,
    Demo2Component,
    HomeComponent,
    Demo3Component
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
