import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatMenuModule} from "@angular/material/menu";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

import { AppComponent } from './app.component';
import { VinprovningComponent } from './vinprovning/vinprovning.component';
import { DruvorComponent } from './druvor/druvor.component';
import { DruvaComponent } from './druvor/druva/druva.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { WinesComponent } from './wines/wines.component';
import { TravelsComponent } from './travels/travels.component';
import { VinmonopoletComponent } from './vinmonopolet/vinmonopolet.component';
import { WikipediaComponent } from './wikipedia/wikipedia.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";

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
    VinmonopoletComponent,
    WikipediaComponent
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
    ]),
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
