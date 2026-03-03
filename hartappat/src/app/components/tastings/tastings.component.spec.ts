import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingsComponent} from './tastings.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TastingComponent} from "./tasting/tasting.component";
import {BackendService, WineTasting} from "../../services/backend.service";
import {Observable, of} from "rxjs";

describe('TastingsComponent', () => {
  let component: TastingsComponent;
  let fixture: ComponentFixture<TastingsComponent>;

  const backendServiceStub: Partial<BackendService> = {
    getTastings(): Observable<WineTasting[]> {
      return of([
        {id:1,  title: 'a title', notes: 'some nuts', tastingDate: new Date('today')},
        {id:2,  title: 'a title', notes: 'some notes', tastingDate: new Date('yesterday')},
        {id:3,  title: 'a title', notes: 'some notes', tastingDate: new Date('tomorrow')},
      ]);
    }
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ TastingsComponent, TastingComponent ],
      providers: [{provide: BackendService, useValue: backendServiceStub}],
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

// class MockBackendService
