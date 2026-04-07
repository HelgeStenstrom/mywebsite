import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingWineComponent} from './tasting-wine.component';
import {WineTasting, WineTastingWine} from "../../models/tasting.model";
import {ActivatedRoute, convertToParamMap, provideRouter} from "@angular/router";
import {TastingService} from "../../services/backend/tasting.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {WineService} from "../../services/backend/wine.service";
import {WineApi} from "../../models/wine.model";

describe('TastingWineComponent', () => {
  let component: TastingWineComponent;
  let fixture: ComponentFixture<TastingWineComponent>;

  const mockTastingWine: WineTastingWine = {
    id: 5,
    wineId: 7,
    position: 3,
    purchasePrice: 129,
    averageScore: 14.5,
    scoreStdDev: null,
  };

  const mockedWine: WineApi = {
    id: 7,
    name: 'Château Testvin',
    country: {id: 1, name: 'Frankrike'},
    wineType: {id: 1, name: 'Rött'},
    isNonVintage: false,
    vintageYear: 2024,
    isUsed: false,
    systembolaget: 4711,
  };

  const mockTasting: WineTasting = {
    id: 42, tastingDate: "2024-01-01", title: "Mocked title"
  }

  const wineServiceMock = {
    getWine: jest.fn().mockReturnValue(of(mockedWine)),
  };
  const tastingServiceMock = {
    getTastingWine: jest.fn().mockReturnValue(of(mockTastingWine)),
    getTasting: jest.fn().mockReturnValue(of(mockTasting)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TastingWineComponent],
      providers: [
        provideRouter([]),
        {provide: TastingService, useValue: tastingServiceMock},
        {provide: WineService, useValue: wineServiceMock},
        {provide: ActivatedRoute, useValue: {snapshot: {paramMap: convertToParamMap({id: '3', tastingWineId: '5'})}}},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TastingWineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('displays the tasting wine position', () => {
    const element = fixture.nativeElement.querySelector('[data-test="tasting-wine-position"]');
    expect(element.textContent).toContain('3');
  });

  test('displays the tasting wine purchase price', () => {
    const element = fixture.nativeElement.querySelector('[data-test="price"]');
    expect(element.textContent).toContain('129');
  });

  test('fetches tasting wine using ids from route', () => {
    const expectedTastingId = 3;
    const expectedTastingWineId = 5;
    expect(tastingServiceMock.getTastingWine).toHaveBeenCalledWith(expectedTastingId, expectedTastingWineId);
  });

  test('displays the wine name', () => {
    const element = fixture.nativeElement.querySelector('[data-test="wine-name"]');
    expect(element.textContent).toContain('Château Testvin');
  });

  test('displays the wine country', () => {
    const element = fixture.nativeElement.querySelector('[data-test="wine-country"]');
    expect(element.textContent).toContain('Frankrike');
  });

  test('displays the vintage year', () => {
    const element = fixture.nativeElement.querySelector('[data-test="wine-vintage-year"]');
    expect(element.textContent).toContain('2024');
  });

  test('displays the average score', () => {
    const element = fixture.nativeElement.querySelector('[data-test="average-score"]');
    expect(element.textContent).toContain('14.5');
  })

  test('displays the wine type', () => {
    const element = fixture.nativeElement.querySelector('[data-test="wine-type"]');
    expect(element.textContent).toContain('Rött');
  })

  test('displays the product number at Systembolaget', () => {
    const element = fixture.nativeElement.querySelector('[data-test="systembolaget"]');
    expect(element.textContent).toContain('4711');
  })

  test('The product number is a link', () => {
    const link = fixture.nativeElement.querySelector('[data-test="systembolaget"] a');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('https://www.systembolaget.se/4711');
  })

  test('displays the tasting date', () => {
    const element = fixture.nativeElement.querySelector('[data-test="tasting-date"]');
    expect(element.textContent).toContain('2024-01-01');
  })

  test('displays the tasting title', () => {
    const element = fixture.nativeElement.querySelector('[data-test="tasting-title"]');
    expect(element.textContent).toContain('Mocked title');
  })

  test('the test title is a link', () => {
    const link = fixture.nativeElement.querySelector('[data-test="tasting-title"]');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('/tastings/42');
  })

});
