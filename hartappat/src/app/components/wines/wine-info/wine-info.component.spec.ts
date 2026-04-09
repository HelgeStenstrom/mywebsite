import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineInfoComponent} from './wine-info.component';
import {WineApi, WineGrape} from "../../../models/wine.model";
import {Grape} from "../../../models/common.model";
import {provideRouter} from "@angular/router";
import {GrapeService} from "../../../services/backend/grape.service";
import {WineService} from "../../../services/backend/wine.service";
import {of} from "rxjs";

describe('WineInfoComponent', () => {
  let component: WineInfoComponent;
  let fixture: ComponentFixture<WineInfoComponent>;

  const mockedWineGrape1: WineGrape = {grapeId: 1, id: 0, percentage: null, wineId: 0};
  const mockedWineGrape2: WineGrape = {grapeId: 2, id: 0, percentage: null, wineId: 0};
  const mockedGrape1: Grape = {id: 1, name: "Test grape 1", color: "gul", isUsed: false};
  const mockedGrape2: Grape = {id: 2, name: "Test grape 2", color: "lila", isUsed: false};

  const mockedWine: WineApi = {
    country: {id: 17, name: "Testland"},
    grapes: [mockedWineGrape1, mockedWineGrape2],
    id: 0,
    isNonVintage: false,
    isUsed: false,
    name: "Testvin",
    vintageYear: null,
    wineType: {id: 0, name: "testColor"}
  }

  let wineServiceMock : Partial<WineService>;
  let grapeServiceMock : Partial<GrapeService>;


  beforeEach(async () => {
     wineServiceMock = {
      getWine: jest.fn().mockReturnValue(of(mockedWine)),
    }
    grapeServiceMock = {
       getGrapes: jest.fn().mockReturnValue(of([mockedGrape1, mockedGrape2])),
       getGrape: jest.fn()
         .mockReturnValueOnce(of(mockedGrape1))
         .mockReturnValueOnce(of(mockedGrape2)),
    }



    await TestBed.configureTestingModule({
      imports: [WineInfoComponent],
      providers: [
        provideRouter([]),
        {provide: WineService, useValue: wineServiceMock},
        {provide: GrapeService, useValue: grapeServiceMock},
      ],

    })
    .compileComponents();



    fixture = TestBed.createComponent(WineInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('The title/header displays the wine name', () => {
    const element = fixture.nativeElement.querySelector('[data-test="wine-title"]');
    expect(element.textContent).toContain('Testvin');
  })

  test('The tab title displays the wine name.', ()  => {
    expect(document.title).toContain('Testvin');
  });

  test('First sentence displays the wine name, color and country', () => {
    const element = fixture.nativeElement.querySelector('[data-test="first-sentence"]');
    expect(element.textContent).toContain('Testvin');
    expect(element.textContent).toContain('Testland');
    expect(element.textContent).toContain('testColor');
  })

  test("it displays about contents, if there are grapes", () => {
    const element = fixture.nativeElement.querySelector('[data-test="it-contains"]');
    expect(element).toBeTruthy();
  })

  test('The second sentence displays the first grape', () => {
      const element = fixture.nativeElement.querySelector('[data-test="it-contains"]');
      expect(element.textContent).toContain('Test grape 1');
    }
  )

  test('displays a table row for each grape with name, color and percentage', () => {
    const rows = fixture.nativeElement.querySelectorAll('[data-test="grape-row"]');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('Test grape 1');
    expect(rows[0].textContent).toContain('gul');
    expect(rows[1].textContent).toContain('Test grape 2');
    expect(rows[1].textContent).toContain('lila');
  });

  describe('when wine has no grapes', () => {
    beforeEach(async () => {
      const emptyWineServiceMock = {
        getWine: jest.fn().mockReturnValue(of({ ...mockedWine, grapes: [] })),
      };

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [WineInfoComponent],
        providers: [
          provideRouter([]),
          { provide: WineService, useValue: emptyWineServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(WineInfoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test("it doesn't display about contents, if there are no grapes", () => {
      const element = fixture.nativeElement.querySelector('[data-test="it-contains"]');
      expect(element).toBeNull();
    });
  });
});


