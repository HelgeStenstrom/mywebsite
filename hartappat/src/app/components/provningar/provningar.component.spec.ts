import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProvningarComponent} from './provningar.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TastingComponent} from "./tasting/tasting.component";
import {BackendService, WineTastingApi} from "../../services/backend.service";
import {Observable, of} from "rxjs";

describe('ProvningarComponent', () => {
  let component: ProvningarComponent;
  let fixture: ComponentFixture<ProvningarComponent>;

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
      declarations: [ ProvningarComponent, TastingComponent ],
      providers: [{provide: BackendService, useValue: backendServiceStub}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvningarComponent);
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
