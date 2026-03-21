import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineEntryComponent} from './wine-entry.component';
import {By} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {DebugElement} from "@angular/core";
import {CommonModule} from "@angular/common";
import {of} from "rxjs";
import {CountryService} from "../../services/backend/country.service";
import {WineTypeService} from "../../services/backend/wine-type.service";
import {WineCreate} from "../../models/wine.model";
import {WineService} from "../../services/backend/wine.service";

// Inspired by https://youtu.be/uefGmRcIm3c
// What building with TDD actually looks like

describe('WineEntryComponent', () => {
  let component: WineEntryComponent;
  let fixture: ComponentFixture<WineEntryComponent>;



  const countryServiceMock = {
    getCountries: () => of([]),
  };

  const wineTypeServiceMock = {
    getWineTypes: () => of([
      { id: 3, name: 'Rött' },
      { id: 4, name: 'Vitt' }
    ]),
  }

  const wineServiceMock = {
    getWine: jest.fn().mockReturnValue(of({
      id: 1,
      name: 'Testvin',
      country: { id: 1, name: 'Sverige' },
      wineType: { id: 3, name: 'Rött' },
      vintageYear: 2020,
      isNonVintage: false,
      isUsed: false,
    })),
    patchWine: jest.fn().mockReturnValue(of({})),
    addWine: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      declarations: [WineEntryComponent],
      imports: [CommonModule, FormsModule],
      providers: [
        {provide: CountryService, useValue: countryServiceMock},
        {provide: WineTypeService, useValue: wineTypeServiceMock},
        { provide: WineService, useValue: wineServiceMock },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WineEntryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a Name input', () => {
    const debugElement = fixture.debugElement.query(
      By.css('[data-test="name-input"]'));
    expect(debugElement).toBeTruthy();
  });

  it('should have a Country selector', () => {
    const debugElement = fixture.debugElement.query(
      By.css('[data-test="country-input"]'));
    expect(debugElement).toBeTruthy();
  });

  it('should have a Type selector', () => {
    const debugElement = findElement("type-input");
    expect(debugElement).toBeTruthy();
  });

  it('should have a Systembolaget input', () => {
    const debugElement = fixture.debugElement.query(
      By.css('[data-test="systembolaget-input"]'));
    expect(debugElement).toBeTruthy();
  });

  it('should have name input, tested differently', () => {
    const nameInput = fixture.nativeElement.querySelector(".nameInput");
    expect(nameInput).toBeTruthy();
  });

  function findElement(identifier: string): DebugElement {
    return fixture.debugElement.query(By.css(`[data-test="${identifier}"]`));
  }

  it('should return an object with wine name', () => {
    component.countryId = 1;
    component.wineTypeId = 2;
    component.wineName = "Ringbolt";

    const expectedName = "Ringbolt";
    const element = findElement("name-input").nativeElement;
    element.value = expectedName;
    element.dispatchEvent(new Event('input'));

    const wine: WineCreate = component.getWine();
    expect(wine.name).toEqual(expectedName);
  });

  it('getWine() should return correct wineTypeId', () => {
    component.countryId = 1;
    component.wineTypeId = 3;
    component.wineName = "Ringbolt";

    expect(component.getWine().wineTypeId).toEqual(3);

    component.wineTypeId = 4;

    expect(component.getWine().wineTypeId).toEqual(4);
  });

  it('should update wineTypeId when selecting in form', async () => {
    component.countryId = 1;
    component.wineTypeId = 3;
    component.wineName = "Ringbolt";
    fixture.detectChanges();
    await fixture.whenStable();

    const select = findElement("type-input").nativeElement;
    select.value = select.options[2].value; // index 0 är "Välj typ", 1 är Rött, 2 är Vitt
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.wineTypeId).toEqual(4);
  });

  it('should return Systembolaget number', () => {

    component.countryId = 1;
    component.wineTypeId = 3;
    fixture.detectChanges();

    const expectedNumber = 23;
    const element = findElement("systembolaget-input").nativeElement;
    element.value = expectedNumber;
    element.dispatchEvent(new Event('input'));

    const wine: WineCreate = component.getWine();
    expect(wine.systembolaget).toEqual(expectedNumber);
  });

  test('prefills form fields when wineId is set', () => {
    component.wineId = 1;
    fixture.detectChanges();

    expect(component.wineName).toBe('Testvin');
    expect(component.countryId).toBe(1);
    expect(component.wineTypeId).toBe(3);
    expect(component.vintage).toEqual(2020);
  });

  test('should have a save button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('[data-test="add-wine-button"]');
    expect(button).toBeTruthy();
  });

  test('calls addWine when saving without wineId', () => {
    wineServiceMock.addWine = jest.fn().mockReturnValue(of({}));
    component.wineName = 'Testvin';
    component.countryId = 1;
    component.wineTypeId = 3;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-test="add-wine-button"]');
    button.click();

    expect(wineServiceMock.addWine).toHaveBeenCalled();
  });

  test('calls patchWine when saving with wineId', () => {
    component.wineId = 1;
    component.wineName = 'Testvin';
    component.countryId = 1;
    component.wineTypeId = 3;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-test="add-wine-button"]');
    button.click();

    expect(wineServiceMock.patchWine).toHaveBeenCalled();
    expect(wineServiceMock.addWine).not.toHaveBeenCalled();
  });

});
