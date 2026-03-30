import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineDetailComponent} from './wine-detail.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {ActivatedRoute, convertToParamMap} from "@angular/router";
import {WineService} from "../../../services/backend/wine.service";
import {of} from "rxjs";
import {WineGrapesComponent} from "../../wine-grapes/wine-grapes.component";

describe('WineDetailComponent', () => {
  let component: WineDetailComponent;
  let fixture: ComponentFixture<WineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WineDetailComponent, WineGrapesComponent],
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
