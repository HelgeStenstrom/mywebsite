import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingsComponent} from './tastings.component';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {TastingComponent} from "./tasting/tasting.component";
import {Observable, of} from "rxjs";
import {CreateTastingComponent} from "./create-tasting/create-tasting.component";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {TastingService} from "../../services/backend/tasting.service";
import {WineTasting} from "../../models/tasting.model";
import {provideHttpClient} from "@angular/common/http";
import {provideRouter} from "@angular/router";

describe('TastingsComponent', () => {
  let component: TastingsComponent;
  let fixture: ComponentFixture<TastingsComponent>;


  const tastingServiceStub: Partial<TastingService> = {
    getTastings(): Observable<WineTasting[]> {
      return of([
        {id:1,  title: 'a title', notes: 'some nuts', tastingDate:  '2026-03-05'},
        {id:2,  title: 'a title', notes: 'some notes', tastingDate: '2026-03-04'},
        {id:3,  title: 'a title', notes: 'some notes', tastingDate: '2026-03-06'},
      ]);
    },
    getTasting(id: number): Observable<WineTasting> {  // lägg till denna
      return of({ id, title: 'a title', notes: 'some notes', tastingDate: '2026-03-05' });
    }
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TastingsComponent,  ],
      imports: [CreateTastingComponent,TastingComponent,],
      providers: [
        provideRouter([]),
        {provide: TastingService, useValue: tastingServiceStub},provideHttpClient(), provideHttpClientTesting()],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TastingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});

