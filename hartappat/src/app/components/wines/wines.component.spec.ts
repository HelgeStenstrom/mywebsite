import {ComponentFixture, TestBed} from '@angular/core/testing';

import WinesComponent from './wines.component';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {WineEntryComponent} from "../wine-entry/wine-entry.component";
import {FormsModule} from "@angular/forms";
import {CountryService} from "../../services/backend/country.service";
import {of} from "rxjs";
import {WineTypeService} from "../../services/backend/wine-type.service";
import {WineService} from "../../services/backend/wine.service";
import {provideHttpClient} from "@angular/common/http";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('WinesComponent', () => {
  let component: WinesComponent;
  let fixture: ComponentFixture<WinesComponent>;

  let countryServiceMock: Partial<CountryService>;
  let wineTypeServiceMock: Partial<WineTypeService>;
  let wineServiceMock: Partial<WineService>;

  beforeEach(async () => {

    wineServiceMock = {
      getWines: jest.fn().mockReturnValue(of([
        { id: 2, name: 'Riesling Auslese', country: 'Tyskland', wineType: 'Vitt', isUsed: false },
        { id: 1, name: 'Château Margaux', country: 'Frankrike', wineType: 'Rött', isUsed: false },
      ])),
      addWine: jest.fn().mockReturnValue(of(void 1)),
    }

    countryServiceMock = {
      getCountries: jest.fn().mockReturnValue(of([])),
    };

    wineTypeServiceMock = {
      getWineTypes: jest.fn().mockReturnValue(of([])),
    }

    await TestBed.configureTestingModule({
      imports: [FormsModule, WineEntryComponent],
      declarations: [ WinesComponent ],
      providers: [provideHttpClient(), provideHttpClientTesting(),
        {provide: CountryService, useValue: countryServiceMock},
        {provide: WineTypeService, useValue: wineTypeServiceMock},
        {provide: WineService, useValue: wineServiceMock},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Sorting', () => {

    test('clicking name header sorts wines by name ascending', () => {
      fixture.detectChanges();
      const nameHeader = fixture.nativeElement.querySelector('[data-test="header-name"]');
      nameHeader.click();
      fixture.detectChanges();

      const cells = fixture.nativeElement.querySelectorAll('[data-test="wine-name"]');
      expect(cells[0].textContent.trim()).toBe('Château Margaux');
      expect(cells[1].textContent.trim()).toBe('Riesling Auslese');
    });

    test('clicking name header twice sorts wines by name descending', () => {
      fixture.detectChanges();
      const nameHeader = fixture.nativeElement.querySelector('[data-test="header-name"]');
      nameHeader.click();
      nameHeader.click();
      fixture.detectChanges();

      const cells = fixture.nativeElement.querySelectorAll('[data-test="wine-name"]');
      expect(cells[0].textContent.trim()).toBe('Riesling Auslese');
      expect(cells[1].textContent.trim()).toBe('Château Margaux');
    });

    test('clicking country header sorts wines by country ascending', () => {
      fixture.detectChanges();
      const countryHeader = fixture.nativeElement.querySelector('[data-test="header-country"]');
      countryHeader.click();
      fixture.detectChanges();

      const cells = fixture.nativeElement.querySelectorAll('[data-test="wine-country"]');
      expect(cells[0].textContent.trim()).toBe('Frankrike');
      expect(cells[1].textContent.trim()).toBe('Tyskland');
    });


    test('clicking name header three times resets sorting', () => {
      fixture.detectChanges();
      const nameHeader = fixture.nativeElement.querySelector('[data-test="header-name"]');
      nameHeader.click();
      nameHeader.click();
      nameHeader.click();
      fixture.detectChanges();

      expect(component.sortColumn).toBe('');
    });

    test('shows ascending icon on active sort column', () => {
      fixture.detectChanges();
      const nameHeader = fixture.nativeElement.querySelector('[data-test="header-name"]');
      nameHeader.click();
      fixture.detectChanges();

      expect(nameHeader.textContent).toContain('arrow_upward');
    });

    test('shows descending icon on active sort column when sorted descending', () => {
      fixture.detectChanges();
      const nameHeader = fixture.nativeElement.querySelector('[data-test="header-name"]');
      nameHeader.click();
      nameHeader.click();
      fixture.detectChanges();

      expect(nameHeader.textContent).toContain('arrow_downward');
    });


  })

});
