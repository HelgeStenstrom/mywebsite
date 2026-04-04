import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddGrapeComponent} from './add-grape.component';
import {Observable, of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Grape} from "../../../models/common.model";
import {GrapeService} from "../../../services/backend/grape.service";
import {WineService} from "../../../services/backend/wine.service";

// Informative: https://testing-angular.com/testing-components-with-children/

describe('AddGrapeComponent test with mock', () => {
  let component: AddGrapeComponent;
  let fixture: ComponentFixture<AddGrapeComponent>;

  const cs: Grape = {id: 0, name: 'Cabernet Sauvignon', color: 'blå', isUsed: false};
  const grapeServiceStub: Partial<GrapeService> = {
    getGrapes(): Observable<Grape[]> {
      const r: Grape = {id: 0, name: 'Riesling', color: 'grön', isUsed: false};
      return of([r, cs]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGrapeComponent],
      providers: [
        {provide: GrapeService, useValue: grapeServiceStub},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}}],
      schemas: [NO_ERRORS_SCHEMA]})
      .compileComponents();

    fixture = TestBed.createComponent(AddGrapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    expect(component).toBeTruthy();
  });

  it('Härma artikeln', () => {
    const {debugElement} = fixture;
    const counter = debugElement.query(By.css('app-counter'));

    expect(counter).toBeFalsy();
  });


});


describe('AddGrapeComponent with jasmine spies', () => {

  let component: AddGrapeComponent;
  let fixture: ComponentFixture<AddGrapeComponent>;


  let grapeServiceStub : Partial<GrapeService>;
  let wineServiceStub : Partial<WineService>;


  beforeEach( async() => {

    grapeServiceStub = {
      addGrape: jest.fn().mockReturnValue(of(void 1)),
      deleteGrape: jest.fn(),
      getGrapes: jest.fn(),
      patchGrape: jest.fn(),
    }

    wineServiceStub = {
      getWines: jest.fn(),
    }

    await TestBed.configureTestingModule({
      imports: [AddGrapeComponent],
      providers: [
        {provide: GrapeService, useValue: grapeServiceStub},
        {provide: WineService, useValue: wineServiceStub},
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
    expect(grapeServiceStub.addGrape).toHaveBeenCalledTimes(0);  // Fails now; why?
    expect(grapeServiceStub.getGrapes).toHaveBeenCalledTimes(0);
  });

  it('calls the backend when adding a grape', () => {
    component.grapeForm.setValue({name: 'saf', color: 'sdf'});

    component.addGrape();
    expect(grapeServiceStub.addGrape).toHaveBeenCalled();  // Fails now; why?
    expect(grapeServiceStub.getGrapes).toHaveBeenCalledTimes(0);
  });

});
