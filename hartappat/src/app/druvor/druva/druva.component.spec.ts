import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DruvaComponent} from './druva.component';
import {BackendService, Grape, Wine} from "../../backend.service";
import {Observable, of, NEVER} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {FormControl, FormGroup} from "@angular/forms";
import jasmine from "jasmine";

// Informative: https://testing-angular.com/testing-components-with-children/

describe('DruvaComponent test with mock', () => {
  let component: DruvaComponent;
  let fixture: ComponentFixture<DruvaComponent>;

  const cs: Grape = {name: 'Cabernet Sauvignon', color: 'blå'};
  const backendServiceStub: Partial<BackendService> = {
    getGrapes(): Observable<Grape[]> {
      const r: Grape = {name: 'Riesling', color: 'grön'};
      return of([r, cs]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DruvaComponent],
      providers: [{provide: BackendService, useValue: backendServiceStub}],
      schemas: [NO_ERRORS_SCHEMA]})
      .compileComponents();

    fixture = TestBed.createComponent(DruvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders without errors', () => {
    expect(component).toBeTruthy();
  });

  it('Härma artikeln', () => {
    const {debugElement} = fixture;
    const counter = debugElement.query(By.css('app-counter'));

    expect(counter).toBeTruthy();
  });

  it('it should have a grapeform', () => {
    const {debugElement} = fixture;

    //console.log("debugElement.properties: ", debugElement.properties);
    //const grapeForm: any = debugElement.properties.grapeForm;
    const componentInstance: DruvaComponent = fixture.componentInstance;
    const grapeForm: FormGroup<{
      color: FormControl<string | null>;
      name: FormControl<string | null> }>
      = componentInstance.grapeForm;
    const actual: boolean = grapeForm.valid;
    console.log("is valid? ", actual);
    expect(actual).toBeFalsy();

    const hasColorControl: boolean = grapeForm.contains('color');
    console.log("has color control: ", hasColorControl);
    const nameControl = grapeForm.controls.name;
    const validName = nameControl.valid;
    const name = nameControl.value;
    console.log(name, validName);
    const validator = nameControl.validator;
    console.log(validator);


  });



});


describe('DruvaComponent with hand-made stub', () => {
// https://testing-angular.com/testing-components-depending-on-services/#faking-service-dependencies

  let component: DruvaComponent;
  let fixture: ComponentFixture<DruvaComponent>;

  const fakeBackend: Pick<BackendService, keyof BackendService> = {

    addGrape(grape: Grape): Observable<unknown> {
      return of("");
    },

    getGrapes(): Observable<Grape[]> {
      throw new Error();
      //return of(undefined);
    },

    getWines(): Observable<Wine[]> {
      return of([]);
    }
  };

  beforeEach( async() => {

    await TestBed.configureTestingModule({
      declarations: [DruvaComponent],
      providers: [{provide: BackendService, useValue: fakeBackend}],
      schemas: [NO_ERRORS_SCHEMA]})
      .compileComponents();

    fixture = TestBed.createComponent(DruvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('renders without errors', () => {
    expect(component).toBeTruthy();
  });

  it('can call addGrape() without an error being thrown.', () => {
    component.addGrape();
  });

});


