import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProvningarComponent} from './provningar.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TastingComponent} from "./tasting/tasting.component";
import {BackendService, Tasting} from "../../services/backend.service";
import {Observable, of} from "rxjs";

describe('ProvningarComponent', () => {
  let component: ProvningarComponent;
  let fixture: ComponentFixture<ProvningarComponent>;

  const backendServiceStub: Partial<BackendService> = {
    getTastings(): Observable<Tasting[]> {
      return of([
        {title: 'a title', notes: 'some nuts', date: 'today'},
        {title: 'a title', notes: 'some notes', date: 'yesterday'},
        {title: 'a title', notes: 'some notes', date: 'tomorrow'},
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
