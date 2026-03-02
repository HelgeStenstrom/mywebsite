import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineEntryComponent} from './wine-entry.component';
import {By} from "@angular/platform-browser";
import {BackendService, WineCreate} from "../../services/backend.service";
import {FormsModule} from "@angular/forms";
import {DebugElement} from "@angular/core";
import {CommonModule} from "@angular/common";
import {of} from "rxjs";

// Inspired by https://youtu.be/uefGmRcIm3c
// What building with TDD actually looks like

describe('WineComponent', () => {
  let component: WineEntryComponent;
  let fixture: ComponentFixture<WineEntryComponent>;
  const backendServiceMock = {
    getCountries: () => of([]),
    getWineTypes: () => of([
      { id: 3, name: 'Rött' },
      { id: 4, name: 'Vitt' }
    ]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineEntryComponent],
      imports: [CommonModule, FormsModule],
      providers: [{provide: BackendService, useValue: backendServiceMock}]
    }).compileComponents();
    fixture = TestBed.createComponent(WineEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

    const expectedNumber = 23;
    const element = findElement("systembolaget-input").nativeElement;
    element.value = expectedNumber;
    element.dispatchEvent(new Event('input'));

    const wine: WineCreate = component.getWine();
    expect(wine.systembolaget).toEqual(expectedNumber);
  });

});
