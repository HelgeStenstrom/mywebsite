import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrapeComponent } from './add-grape.component';
import { BackendService, Grape } from "../../../services/backend.service";
import { Observable, of } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { FormControl, FormGroup } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

// Informative: https://testing-angular.com/testing-components-with-children/

describe('AddGrapeComponent test with mock', () => {
  let component: AddGrapeComponent;
  let fixture: ComponentFixture<AddGrapeComponent>;

  const cs: Grape = {id: 0, name: 'Cabernet Sauvignon', color: 'blå'};
  const backendServiceStub: Partial<BackendService> = {
    getGrapes(): Observable<Grape[]> {
      const r: Grape = {id: 0, name: 'Riesling', color: 'grön'};
      return of([r, cs]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AddGrapeComponent],
      providers: [
        {provide: BackendService, useValue: backendServiceStub},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}}],
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

    expect(counter).toBeFalsy();
  });

  it('it should have a grapeform', () => {
    const componentInstance: AddGrapeComponent = fixture.componentInstance;
    const grapeForm: FormGroup<{
      color: FormControl<string | null>;
      name: FormControl<string | null> }>
      = componentInstance.grapeForm;
    const actual: boolean = grapeForm.valid;
    console.log("is valid? ", actual);
    expect(actual).toBeTruthy();

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


describe('AddGrapeComponent with jasmine spies', () => {

  let component: AddGrapeComponent;
  let fixture: ComponentFixture<AddGrapeComponent>;

  let fakeBackend: BackendService;

  beforeEach( async() => {


    // from https://testing-angular.com/testing-components-depending-on-services/#faking-service-dependencies
    fakeBackend = jasmine.createSpyObj<BackendService>(
      'BackendService',
      {
        addGrape: of(void 1),
        deleteGrape: undefined,
        getGrapes: undefined,
        getWines: undefined,
        patchGrape: undefined,
        newEvent: undefined,
      }
    );

    await TestBed.configureTestingModule({
      declarations: [AddGrapeComponent],
      providers: [
        {provide: BackendService, useValue: fakeBackend},
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
      ],
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
