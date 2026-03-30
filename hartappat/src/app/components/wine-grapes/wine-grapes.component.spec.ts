import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineGrapesComponent} from './wine-grapes.component';
import {WineGrape} from "../../models/wine.model";
import {Grape} from "../../models/common.model";
import {GrapeService} from "../../services/backend/grape.service";
import {WineService} from "../../services/backend/wine.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {of} from "rxjs";

describe('WineGrapesComponent', () => {
  let component: WineGrapesComponent;
  let fixture: ComponentFixture<WineGrapesComponent>;
  let wineServiceMock: jest.Mocked<WineService>;
  let grapeServiceMock: jest.Mocked<GrapeService>;

  const mockWineGrapes: WineGrape[] = [
    { id: 1, wineId: 10, grapeId: 3, percentage: 75 },
    { id: 2, wineId: 10, grapeId: 5, percentage: 25 },
  ];

  const mockGrapes: Grape[] = [
    { id: 3, name: 'Cabernet Sauvignon', color: 'blå' , isUsed: false},
    { id: 5, name: 'Merlot', color: 'blå', isUsed: false },
  ];

  beforeEach(() => {
    wineServiceMock = {
      getWineGrapes: jest.fn().mockReturnValue(of(mockWineGrapes)),
      addWineGrape: jest.fn(),
      deleteWineGrape: jest.fn(),
    } as unknown as jest.Mocked<WineService>;

    grapeServiceMock = {
      getGrapes: jest.fn().mockReturnValue(of(mockGrapes)),
    } as unknown as jest.Mocked<GrapeService>;




    TestBed.configureTestingModule({
      imports: [WineGrapesComponent],
      providers: [
        { provide: WineService, useValue: wineServiceMock },
        { provide: GrapeService, useValue: grapeServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WineGrapesComponent);
    component = fixture.componentInstance;
    component.wineId = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('fetches wine grapes and all grapes on init', () => {
    expect(wineServiceMock.getWineGrapes).toHaveBeenCalledWith(10);
    expect(grapeServiceMock.getGrapes).toHaveBeenCalled();
  });

  test('displays existing wine grapes', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-test="wine-grape-item"]');
    expect(items).toHaveLength(2);
  });

  test('filters available grapes based on search term', () => {
    component.searchTerm = 'Mer';
    component.updateFilter();

    expect(component.filteredGrapes).toEqual([
      { id: 5, name: 'Merlot', color: 'blå', isUsed: false },
    ]);
  });


  test('adds a wine grape and refreshes the list', () => {
    const updatedList: WineGrape[] = [...mockWineGrapes, { id: 3, wineId: 10, grapeId: 3, percentage: 50 }];

    wineServiceMock.addWineGrape.mockReturnValue(of({ id: 3, wineId: 10, grapeId: 3, percentage: 50 }));
    wineServiceMock.getWineGrapes.mockReturnValue(of(updatedList));

    component.selectedGrapeId = 3;
    component.percentage = 50;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-test="add-grape-button"]');
    button.click();

    expect(wineServiceMock.addWineGrape).toHaveBeenCalledWith(10, { grapeId: 3, percentage: 50 });
    expect(wineServiceMock.getWineGrapes).toHaveBeenCalledTimes(2);
  });

  test('deletes a wine grape and refreshes the list', () => {
    const updatedList: WineGrape[] = [mockWineGrapes[1]];

    wineServiceMock.deleteWineGrape.mockReturnValue(of(void 0));
    wineServiceMock.getWineGrapes.mockReturnValue(of(updatedList));

    const buttons = fixture.nativeElement.querySelectorAll('[data-test="delete-grape-button"]');
    buttons[0].click();

    expect(wineServiceMock.deleteWineGrape).toHaveBeenCalledWith(10, 1);
    expect(wineServiceMock.getWineGrapes).toHaveBeenCalledTimes(2);
  });

});
