import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingsComponent} from './tastings.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TastingComponent} from "./tasting/tasting.component";
import {BackendService, WineTastingApi} from "../../services/backend.service";
import {Observable, of} from "rxjs";

describe('TastingsComponent', () => {
  let component: TastingsComponent;
  let fixture: ComponentFixture<TastingsComponent>;

  const backendServiceStub: Partial<BackendService> = {
    getTastings(): Observable<WineTastingApi[]> {
      return of([
        {title: 'a title', notes: 'some nuts', tastingDate: 'today'},
        {title: 'a title', notes: 'some notes', tastingDate: 'yesterday'},
        {title: 'a title', notes: 'some notes', tastingDate: 'tomorrow'},
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
