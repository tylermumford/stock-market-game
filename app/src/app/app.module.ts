import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { GameUiComponent } from './game-ui/game-ui.component';
import { RoundEntryComponent } from './round-entry/round-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    GameSetupComponent,
    GameUiComponent,
    RoundEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
