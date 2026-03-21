import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineDetailComponent} from './wine-detail.component';
import {RouterTestingModule} from "@angular/router/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('WineDetailComponent', () => {
  let component: WineDetailComponent;
  let fixture: ComponentFixture<WineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineDetailComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Add tests to check that the wine ID is fetched from the route
  test.skip('should fetch wine ID from route', () => {

    expect(component.wineId).toBe(1);
  })
});
