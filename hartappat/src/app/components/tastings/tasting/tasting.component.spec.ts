import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingComponent} from './tasting.component';
import {RouterTestingModule} from "@angular/router/testing";
import {WineTasting} from "../../../models/tasting.model";
import {of} from "rxjs";
import {TastingService} from "../../../services/backend/tasting.service";
import {MemberService} from "../../../services/backend/member.service";
import {WineService} from "../../../services/backend/wine.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('TastingComponent', () => {
  let component: TastingComponent;
  let fixture: ComponentFixture<TastingComponent>;

  const mockTasting: WineTasting = {
    id: 1,
    title: 'Testprovning',
    notes: '',
    tastingDate: '2024-01-01',
    wines: [
      { id: 1, wineId: 10, position: 1, purchasePrice: null, averageScore: null },
      { id: 2, wineId: 11, position: 2, purchasePrice: null, averageScore: null },
    ],
  };

  const tastingServiceMock = {
    getTasting: jest.fn().mockReturnValue(of(mockTasting)),
  };

  const memberServiceMock = {
    getMembers: jest.fn().mockReturnValue(of([])),
  };

  const wineServiceMock = {
    getWine: jest.fn().mockImplementation((id: number) => of({
      id,
      name: id === 10 ? 'Château Margaux' : 'Testvin',
      country: { id: 1, name: 'Frankrike' },
      wineType: { id: 1, name: 'Rött' },
      vintageYear: 2020,
      isNonVintage: false,
      isUsed: false,
    })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TastingComponent],
      imports: [ RouterTestingModule],
      providers: [
        { provide: TastingService, useValue: tastingServiceMock },
        { provide: MemberService, useValue: memberServiceMock },
        { provide: WineService, useValue: wineServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TastingComponent);
    component = fixture.componentInstance;
    component.tasting = mockTasting;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('displays wine name for each tasting wine', () => {
    const cells = fixture.nativeElement.querySelectorAll('[data-test="wine-name"]');
    expect(cells[0].textContent).toContain('Château Margaux');
  });

  test('displays country for each tasting wine', () => {
    const cells = fixture.nativeElement.querySelectorAll('[data-test="wine-country"]');
    expect(cells[0].textContent).toContain('Frankrike');
  });


  test('displays type for each tasting wine', () => {
    const cells = fixture.nativeElement.querySelectorAll('[data-test="wine-type"]');
    expect(cells[0].textContent).toContain('Rött');
  });


});
