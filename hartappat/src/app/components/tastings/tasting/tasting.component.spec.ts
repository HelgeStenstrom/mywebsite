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
    getTasting: jest.fn().mockImplementation(() => of({...mockTasting, wines: [...mockTasting.wines!]})),
    deleteWineFromTasting: jest.fn().mockReturnValue(of(void 0)),
    patchWineInTasting:  jest.fn().mockReturnValue(of(void 0)),
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
    resetMocks(tastingServiceMock, mockTasting, memberServiceMock, wineServiceMock);

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

  test('deletes a wine from tasting and refreshes', () => {
    const firstWine = mockTasting.wines?.[0];
    const secondWine = mockTasting.wines?.[1];
    const updatedTasting = {
      ...mockTasting,
      wines: [secondWine],
    };

    tastingServiceMock.deleteWineFromTasting = jest.fn().mockReturnValue(of(void 0));
    tastingServiceMock.getTasting = jest.fn().mockReturnValue(of(updatedTasting));

    const buttons = fixture.nativeElement.querySelectorAll('[data-test="delete-tasting-wine-button"]');
    buttons[0].click();

    expect(tastingServiceMock.deleteWineFromTasting).toHaveBeenCalledWith(1, firstWine?.id);

    expect(tastingServiceMock.deleteWineFromTasting).toHaveBeenCalledWith(1, firstWine?.id);
  });

  test('clicking a position cell starts editing that row', () => {
    const spans = fixture.nativeElement.querySelectorAll('[data-test="position-value"]');
    spans[0].click();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-test="position-input"]');
    expect(input).toBeTruthy();
  });


  test('clicking a price cell starts editing that row', () => {
    const spans = fixture.nativeElement.querySelectorAll('[data-test="price-value"]');
    spans[0].click();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-test="price-input"]');
    expect(input).toBeTruthy();
  });



  test('clicking a score cell starts editing that row', () => {
    const spans = fixture.nativeElement.querySelectorAll('[data-test="score-value"]');
    spans[0].click();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-test="score-input"]');
    expect(input).toBeTruthy();
  });



  test('saving edited values calls patchWineInTasting with correct values', () => {
    const spans = fixture.nativeElement.querySelectorAll('[data-test="position-value"]');
    spans[0].click();
    fixture.detectChanges();

    component.editValues.position = 5;
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('[data-test="save-tasting-wine-button"]');
    saveButton.click();

    expect(tastingServiceMock.patchWineInTasting).toHaveBeenCalledWith(1, 1, {
      position: 5,
      purchasePrice: null,
      averageScore: null,
    });
  });

});

function resetMocks(tastingServiceMock: {
  getTasting: jest.Mock<any, any, any>;
  deleteWineFromTasting: jest.Mock<any, any, any>;
  patchWineInTasting: jest.Mock<any, any, any>
}, mockTasting: WineTasting, memberServiceMock: { getMembers: jest.Mock<any, any, any> }, wineServiceMock: {
  getWine: jest.Mock<any, any, any>
}) {
  jest.resetAllMocks();
  tastingServiceMock.getTasting.mockReturnValue(of(mockTasting));
  tastingServiceMock.deleteWineFromTasting.mockReturnValue(of(void 0));
  tastingServiceMock.patchWineInTasting.mockReturnValue(of(void 0));
  memberServiceMock.getMembers.mockReturnValue(of([]));
  wineServiceMock.getWine.mockImplementation((id: number) => of({
    id,
    name: id === 10 ? 'Château Margaux' : 'Testvin',
    country: {id: 1, name: 'Frankrike'},
    wineType: {id: 1, name: 'Rött'},
    vintageYear: 2020,
    isNonVintage: false,
    isUsed: false,
  }));
}
