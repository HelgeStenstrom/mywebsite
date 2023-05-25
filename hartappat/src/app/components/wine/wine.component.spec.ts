import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineComponent} from './wine.component';
import {By} from "@angular/platform-browser";
import {Wine} from "../../services/backend.service";
import {FormsModule} from "@angular/forms";
import {DebugElement} from "@angular/core";

// Inspired by https://youtu.be/uefGmRcIm3c
// What building with TDD actually looks like

describe('WineComponent', () => {
  let component: WineComponent;
  let fixture: ComponentFixture<WineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineComponent],
      imports: [FormsModule],

    });
    fixture = TestBed.createComponent(WineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an Add button', () => {
    const debugElement = fixture.debugElement.query(
      By.css('[data-test="add-button"]'));
    expect(debugElement).toBeTruthy();
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

    const expectedName = "Ringbolt";
    const nameElement = findElement("name-input").nativeElement;
    nameElement.value = expectedName;
    nameElement.dispatchEvent(new Event('input'));

    const wine: Wine = component.getWine();
    expect(wine.name).toEqual(expectedName);
  });

  it('should return an object category', () => {

    const expectedType = "vitt";
    const nameElement = findElement("type-input").nativeElement;
    nameElement.value = expectedType;
    nameElement.dispatchEvent(new Event('input'));

    const wine: Wine = component.getWine();
    expect(wine.category).toEqual(expectedType);
  });

});
