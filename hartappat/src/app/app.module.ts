import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {provideHttpClient, withInterceptors} from "@angular/common/http";

import {AppComponent} from './app.component';
import {GrapesComponent} from './components/grapes/grapes.component';
import {AddGrapeComponent} from './components/grapes/add-grape/add-grape.component';
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
import {MembersComponent} from './components/about/members/members.component';
import {WineEntryComponent} from './components/wine-entry/wine-entry.component';
import {CountriesComponent} from './components/countries/countries.component';
import {WineTypesComponent} from './components/wine-types/wine-types.component';
import {CreateTastingComponent} from './components/tastings/create-tasting/create-tasting.component';
import {
  AddWineToTastingComponent
} from './components/tastings/tasting/add-wine-to-tasting/add-wine-to-tasting.component';
import {WineGrapesComponent} from './components/wine-grapes/wine-grapes.component';
import {WineDetailComponent} from './components/wines/wine-detail/wine-detail.component';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {ScoresComponent} from "./components/tastings/scores/scores.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {EditTastingComponent} from "./components/tastings/edit-tasting/edit-tasting.component";
import {credentialsInterceptor} from "./services/interceptors/credentials.interceptor";
import {LoginComponent} from "./components/login/login/login.component";
import {ChangePasswordComponent} from "./components/login/change-password/change-password.component";

@NgModule({
  declarations: [
    AppComponent,
    DndDirective,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'grapes/:add-grape', component: AddGrapeComponent},
      {path: 'grapes', component: GrapesComponent},
      {path: 'viner', component: WinesComponent},
      {path: 'travels', component: TravelsComponent},
      {path: 'about', component: AboutComponent},
      {path: 'tastings/new', component: CreateTastingComponent},
      {path: 'tastings/:id', component: TastingComponent},
      {path: 'tastings/:id/scores', component: ScoresComponent},
      {path: 'tastings/:id/edit', component: EditTastingComponent},
      {path: 'wines/:id', component: WineDetailComponent},
      {path: 'tastings', component: TastingsComponent},
      {path: 'countries', component: CountriesComponent},
      {path: 'wine-types', component: WineTypesComponent},
      {path: 'tests', component: TestbenchComponent},
      {path: 'login', component: LoginComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: '**', component: NotFoundComponent},
    ]),
    NotFoundComponent,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    ScoresComponent,
    DragDropModule,
    AboutComponent,
    MembersComponent,
    VinmonopoletComponent,
    HomeComponent,
    CountriesComponent,
    AddGrapeComponent,
    GrapesComponent,
    NavbarComponent,
    CreateTastingComponent,
    AddWineToTastingComponent,
    TastingComponent,
    TestbenchComponent,
    TravelsComponent,
    WikipediaComponent,
    WineEntryComponent,
    WineTypesComponent,
    WineDetailComponent,
    WineGrapesComponent,
    TastingsComponent,
    WinesComponent,
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: {}},
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideAnimationsAsync(),
  ]
})
export class AppModule {
}
