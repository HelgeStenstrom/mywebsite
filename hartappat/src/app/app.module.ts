import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatMenuModule} from "@angular/material/menu";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

import {AppComponent} from './app.component';
import {VinprovningComponent} from './components/vinprovning/vinprovning.component';
import {DruvorComponent} from './components/druvor/druvor.component';
import {AddGrapeComponent} from './components/druvor/add-grape/add-grape.component';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {AboutComponent} from './components/about/about.component';
import {WinesComponent} from './components/wines/wines.component';
import {TravelsComponent} from './components/travels/travels.component';
import {VinmonopoletComponent} from './components/vinmonopolet/vinmonopolet.component';
import {WikipediaComponent} from './components/wikipedia/wikipedia.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FiledropComponent} from './components/filedrop/filedrop.component';
import {DndDirective} from './dnd.directive';
import {TestbenchComponent} from './components/testbench/testbench.component';
import {ProvningarComponent} from './components/provningar/provningar.component';
import {TastingComponent} from './components/provningar/tasting/tasting.component';
import { AltDruvorComponent } from './components/alt-druvor/alt-druvor.component';

@NgModule({
  declarations: [
    AppComponent,
    VinprovningComponent,
    DruvorComponent,
    AddGrapeComponent,
    HomeComponent,
    NotFoundComponent,
    NavbarComponent,
    AboutComponent,
    WinesComponent,
    TravelsComponent,
    VinmonopoletComponent,
    WikipediaComponent,
    FiledropComponent,
    DndDirective,
    TestbenchComponent,
    ProvningarComponent,
    TastingComponent,
    AltDruvorComponent
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
      {path: 'druvor/:add-grape', component: AddGrapeComponent},
      {path: 'druvor', component: DruvorComponent},
      {path: 'viner', component: WinesComponent},
      {path: 'resor', component: TravelsComponent},
      {path: 'about', component: AboutComponent},
      {path: 'provningar', component: ProvningarComponent},
      {path: 'tests', component: TestbenchComponent},
      {path: '**', component: NotFoundComponent},
    ]),
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
    MatDialogModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: MatDialogRef, useValue:{}},
    {provide: MAT_DIALOG_DATA, useValue:{}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
