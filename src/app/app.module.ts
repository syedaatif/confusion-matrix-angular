import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfusionMatrixComponent } from './confusion-matrix/confusion-matrix.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfusionMatrixComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
