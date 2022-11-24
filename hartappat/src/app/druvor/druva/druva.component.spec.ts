import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DruvaComponent } from './druva.component';
import {BackendService, Grape} from "../../backend.service";
import {Observable, of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

// Informative: https://testing-angular.com/testing-components-with-children/

describe('DruvaComponent test with mock', () => {
  let component: DruvaComponent;
  let fixture: ComponentFixture<DruvaComponent>;

  const cs: Grape = {name:'Cabernet Sauvignon', color:'blå'};
  const backendServiceStub: Partial<BackendService> = {
    getGrapes(): Observable<Grape[]> {
      const r: Grape = {name:'Riesling', color:'grön'};
      return of([r, cs]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DruvaComponent ],
      providers: [{provide: BackendService, useValue: backendServiceStub}],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DruvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders without errors', () => {
    expect(component).toBeTruthy();
  });

  it('Härma artikeln', () => {
    const { debugElement } = fixture;
    const counter = debugElement.query(By.css('app-counter'));

    expect(counter).toBeTruthy();
  });

  it('it should have a grapeform', () => {
    const { debugElement } = fixture;

    console.log("debugElement.properties: ", debugElement.properties);
    //const grapeForm: any = debugElement.properties.grapeForm;

  });

});
