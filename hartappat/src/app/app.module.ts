import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { VinprovningComponent } from './vinprovning/vinprovning.component';
import { DruvorComponent } from './druvor/druvor.component';
import { DruvaComponent } from './druvor/druva/druva.component';
import {RouterModule} from "@angular/router";
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import {HttpClientModule} from "@angular/common/http";
import { WinesComponent } from './wines/wines.component';
import { TravelsComponent } from './travels/travels.component';
import { VinmonopoletComponent } from './vinmonopolet/vinmonopolet.component';

@NgModule({
  declarations: [
    AppComponent,
    VinprovningComponent,
    DruvorComponent,
    DruvaComponent,
    HomeComponent,
    NotFoundComponent,
    NavbarComponent,
    AboutComponent,
    WinesComponent,
    TravelsComponent,
    VinmonopoletComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'druvor/:druva', component: DruvaComponent},
      {path: 'druvor', component: DruvorComponent},
      {path: 'viner', component: WinesComponent},
      {path: 'resor', component: TravelsComponent},
      {path: 'about', component: AboutComponent},
      {path: '**', component: NotFoundComponent},
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
