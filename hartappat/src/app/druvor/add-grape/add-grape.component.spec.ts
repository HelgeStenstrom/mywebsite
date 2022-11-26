import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddGrapeComponent} from './add-grape.component';
import {BackendService, Grape, Wine} from "../../backend.service";
import {Observable, of, NEVER, EMPTY} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {FormControl, FormGroup} from "@angular/forms";
// import jasmine from "jasmine";

// Informative: https://testing-angular.com/testing-components-with-children/

describe('DruvaComponent test with mock', () => {
  let component: AddGrapeComponent;
  let fixture: ComponentFixture<AddGrapeComponent>;

  const cs: Grape = {name: 'Cabernet Sauvignon', color: 'blå'};
  const backendServiceStub: Partial<BackendService> = {
    getGrapes(): Observable<Grape[]> {
      const r: Grape = {name: 'Riesling', color: 'grön'};
      return of([r, cs]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddGrapeComponent],
      providers: [{provide: BackendService, useValue: backendServiceStub}],
      schemas: [NO_ERRORS_SCHEMA]})
      .compileComponents();

    fixture = TestBed.createComponent(AddGrapeComponent);
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
    const componentInstance: AddGrapeComponent = fixture.componentInstance;
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

  let component: AddGrapeComponent;
  let fixture: ComponentFixture<AddGrapeComponent>;

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
      declarations: [AddGrapeComponent],
      providers: [{provide: BackendService, useValue: fakeBackend}],
      schemas: [NO_ERRORS_SCHEMA]})
      .compileComponents();

    fixture = TestBed.createComponent(AddGrapeComponent);
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

describe('DruvaComponent with jasmine spies', () => {

  let component: AddGrapeComponent;
  let fixture: ComponentFixture<AddGrapeComponent>;

  let fakeBackend: BackendService;

  beforeEach( async() => {

    // Create fake backend
    //jasmine.createSpyObj()
    // const x = jasmine.createSpyObj('Basename', {})
    fakeBackend = jasmine.createSpyObj<BackendService>(
      'BackendService', {
        getWines: undefined,
        getGrapes: undefined,
        addGrape: of(EMPTY),
      }
    );

    await TestBed.configureTestingModule({
      declarations: [AddGrapeComponent],
      providers: [{provide: BackendService, useValue: fakeBackend}],
      schemas: [NO_ERRORS_SCHEMA]})
      .compileComponents();

    fixture = TestBed.createComponent(AddGrapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Doesnt call the backend when adding a grape, if there is no grape definition', () => {

    component.addGrape();
    expect(fakeBackend.addGrape).toHaveBeenCalledTimes(0);  // Fails now; why?
    expect(fakeBackend.getGrapes).toHaveBeenCalledTimes(0);
  });

  it('calls the backend when adding a grape', () => {
    component.grapeForm.setValue({name: 'saf', color: 'sdf'});

    component.addGrape();
    expect(fakeBackend.addGrape).toHaveBeenCalled();  // Fails now; why?
    expect(fakeBackend.getGrapes).toHaveBeenCalledTimes(0);
  });

});
