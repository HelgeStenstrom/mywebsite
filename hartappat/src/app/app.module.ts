import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatMenuModule} from "@angular/material/menu";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppComponent} from './app.component';
import {DruvorComponent} from './components/druvor/druvor.component';
import {AddGrapeComponent} from './components/druvor/add-grape/add-grape.component';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {AboutComponent} from './components/about/about.component';
import WinesComponent from './components/wines/wines.component';
import {TravelsComponent} from './components/travels/travels.component';
import {VinmonopoletComponent} from './components/vinmonopolet/vinmonopolet.component';
import {WikipediaComponent} from './components/wikipedia/wikipedia.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {DndDirective} from './dnd.directive';
import {TestbenchComponent} from './components/testbench/testbench.component';
import {TastingsComponent} from './components/tastings/tastings.component';
import {TastingComponent} from './components/tastings/tasting/tasting.component';
import {AltDruvorComponent} from './components/alt-druvor/alt-druvor.component';
import {MembersComponent} from './components/about/members/members.component';
import {VotingComponent} from './components/voting/voting.component';
import {WineEntryComponent} from './components/wine-entry/wine-entry.component';
import {ExtraHeaderInterceptor} from "./services/interceptors/extra-header-interceptor";
import {CountriesComponent} from './components/countries/countries.component';
import {WineTypesComponent} from './components/wine-types/wine-types.component';
import {CreateTastingComponent} from './components/tastings/create-tasting/create-tasting.component';
import {
  AddWineToTastingComponent
} from './components/tastings/tasting/add-wine-to-tasting/add-wine-to-tasting.component';
import {WineGrapesComponent} from './components/wine-grapes/wine-grapes.component';
import {WineDetailComponent} from './components/wines/wine-detail/wine-detail.component';

@NgModule({
  declarations: [
    AppComponent,
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
    DndDirective,
    TestbenchComponent,
    TastingsComponent,
    TastingComponent,
    AltDruvorComponent,
    MembersComponent,
    VotingComponent,
    WineEntryComponent,
    CountriesComponent,
    WineTypesComponent,
    CreateTastingComponent,
    AddWineToTastingComponent,
    WineGrapesComponent,
    WineDetailComponent
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
      {path: 'voting', component: VotingComponent},
      {path: 'tastings/new', component: CreateTastingComponent},
      {path: 'tastings/:id', component: TastingComponent},
      {path: 'wines/:id', component: WineDetailComponent},
      {path: 'tastings', component: TastingsComponent},
      {path: 'countries', component: CountriesComponent},
      {path: 'wine-types', component: WineTypesComponent},
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
    {provide: HTTP_INTERCEPTORS, useClass: ExtraHeaderInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
