import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingsComponent} from './tastings.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TastingComponent} from "./tasting/tasting.component";
import {BackendService, WineTasting} from "../../services/backend/backend.service";
import {Observable, of} from "rxjs";
import {CreateTastingComponent} from "./create-tasting/create-tasting.component";
import {RouterTestingModule} from "@angular/router/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('TastingsComponent', () => {
  let component: TastingsComponent;
  let fixture: ComponentFixture<TastingsComponent>;

  const backendServiceStub: Partial<BackendService> = {
    getTastings(): Observable<WineTasting[]> {
      return of([
        {id:1,  title: 'a title', notes: 'some nuts', tastingDate: new Date('2026-03-05')},
        {id:2,  title: 'a title', notes: 'some notes', tastingDate: new Date('2026-03-04')},
        {id:3,  title: 'a title', notes: 'some notes', tastingDate: new Date('2026-03-06')},
      ]);
    },
    getTasting(id: number): Observable<WineTasting> {  // lägg till denna
      return of({ id, title: 'a title', notes: 'some notes', tastingDate: new Date('2026-03-05') });
    }
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ TastingsComponent, TastingComponent, CreateTastingComponent ],
      providers: [{provide: BackendService, useValue: backendServiceStub}],
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

  it('should have a list of tastings', () => {

    expect(fixture.nativeElement.querySelector(['[data-test="tasting-list"]'])).toBeTruthy();
  });

  it('should have some tastings', () => {

    expect(fixture.nativeElement.querySelectorAll(['[data-test="tasting"]']).length).toBe(3);
  });

});

