import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WineComponent } from './wine.component';
import {By} from "@angular/platform-browser";

// Inspired by https://youtu.be/uefGmRcIm3c
// What building with TDD actually looks like

describe('WineComponent', () => {
  let component: WineComponent;
  let fixture: ComponentFixture<WineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineComponent]
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
    const debugElement = fixture.debugElement.query(
      By.css('[data-test="type-input"]'));
    expect(debugElement).toBeTruthy();
  });

  it('should have a Systembolaget input', () => {
    const debugElement = fixture.debugElement.query(
      By.css('[data-test="systembolaget-input"]'));
    expect(debugElement).toBeTruthy();
  });

  it('should return a wine object', () => {

    const wine: string = component.getWineAsString();
    expect(wine).toContain("TODO");
  });

});
