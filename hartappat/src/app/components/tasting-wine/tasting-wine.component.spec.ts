import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingWineComponent} from './tasting-wine.component';
import {WineTastingWine} from "../../models/tasting.model";
import {ActivatedRoute, convertToParamMap, provideRouter} from "@angular/router";
import {TastingService} from "../../services/backend/tasting.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {of} from "rxjs";

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

  const tastingServiceMock = {
    getTastingWine: jest.fn().mockReturnValue(of(mockTastingWine)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TastingWineComponent],
      providers: [
        provideRouter([]),
        {provide: TastingService, useValue: tastingServiceMock},
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

});
