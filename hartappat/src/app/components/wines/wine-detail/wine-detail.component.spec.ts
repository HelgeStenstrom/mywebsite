import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineDetailComponent} from './wine-detail.component';
import {RouterTestingModule} from "@angular/router/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {ActivatedRoute, convertToParamMap} from "@angular/router";

describe('WineDetailComponent', () => {
  let component: WineDetailComponent;
  let fixture: ComponentFixture<WineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineDetailComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: convertToParamMap({ id: '42' }),
          },
        },
      },
    ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('sets wineId from route parameter', () => {
    const fixture = TestBed.createComponent(WineDetailComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.wineId).toBe(42);
  });

});
