import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineDetailComponent} from './wine-detail.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {ActivatedRoute, convertToParamMap} from "@angular/router";
import {WineService} from "../../../services/backend/wine.service";
import {of} from "rxjs";
import {CountryService} from "../../../services/backend/country.service";
import {WineTypeService} from "../../../services/backend/wine-type.service";
import {GrapeService} from "../../../services/backend/grape.service";

describe('WineDetailComponent', () => {
  let component: WineDetailComponent;
  let fixture: ComponentFixture<WineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WineDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({id: '42'}),
            },
          },
        },
        {
          provide: WineService,
          useValue: {
            getWine: jest.fn().mockReturnValue(of({
              id: 42,
              name: 'Testvin',
              country: {id: 1, name: 'Sverige'},
              wineType: {id: 1, name: 'Rött'},
              vintageYear: 2020,
              isNonVintage: false,
              isUsed: false,
            })),
            getWineGrapes: jest.fn().mockReturnValue(of([])),
          },
        },
        { provide: CountryService, useValue: { getCountries: jest.fn().mockReturnValue(of([])) } },
        { provide: WineTypeService, useValue: { getWineTypes: jest.fn().mockReturnValue(of([])) } },
        { provide: GrapeService, useValue: { getGrapes: jest.fn().mockReturnValue(of([])) } },

      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('sets wineId from route parameter', () => {


    expect(component.wineId).toBe(42);
  });

});
