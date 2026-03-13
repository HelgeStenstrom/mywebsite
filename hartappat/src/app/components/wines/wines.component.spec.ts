import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WinesComponent} from './wines.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {WineEntryComponent} from "../wine-entry/wine-entry.component";
import {FormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";
import {BackendService} from "../../services/backend/backend.service";
import {CountryService} from "../../services/backend/country.service";
import {of} from "rxjs";
import {WineTypeService} from "../../services/backend/wine-type.service";

describe('WinesComponent', () => {
  let component: WinesComponent;
  let fixture: ComponentFixture<WinesComponent>;

  let backendServiceMock: Partial<BackendService>;
  let countryServiceMock: Partial<CountryService>;
  let wineTypeServiceMock: Partial<WineTypeService>;

  beforeEach(async () => {

    backendServiceMock = {
      getWines: jest.fn().mockReturnValue(of([])),
      addWine: jest.fn().mockReturnValue(of(void 1)),
    };

    countryServiceMock = {
      getCountries: jest.fn().mockReturnValue(of([])),
    };

    wineTypeServiceMock = {
      getWineTypes: jest.fn().mockReturnValue(of([])),
    }

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [ WinesComponent, WineEntryComponent ],
      providers: [
        {provide: BackendService, useValue: backendServiceMock},
        {provide: CountryService, useValue: countryServiceMock},
        {provide: WineTypeService, useValue: wineTypeServiceMock},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the wine from the WineComponent, when the button is clicked', () => {
    // Create a spy for the method
    jest.spyOn(component.wineComponent, 'getWine').mockReturnValue({
      name: 'Testvin',
      countryId: 1,
      wineTypeId: 2,
      systembolaget: 12345,
      volume: 75
    });

    const buttonElement = fixture.debugElement.query(  By.css('[data-test="add-wine-button"]'));

    const querySelector = fixture.nativeElement.querySelector("button");
    expect(querySelector).toEqual(buttonElement.nativeElement);
    buttonElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.wineComponent.getWine).toHaveBeenCalled();
  });

  it('should add a wine to the list, when the button is clicked', () => {
    // Create a spy for the method
    jest.spyOn(component.wineComponent, 'getWine').mockReturnValue({
      name: 'Testvin',
      countryId: 1,
      wineTypeId: 2,
      systembolaget: 42,
      volume: 0
    });

    const buttonElement = fixture.debugElement.query(  By.css('[data-test="add-wine-button"]'));
    buttonElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(backendServiceMock.addWine).toHaveBeenCalled()
  });

  // The test is not implemented yet
  test.skip('should  bring up a form when the edit button is clicked', () => {
    fail('This test is not implemented yet.');
  });

  // The test is not implemented yet
  xit('should delete a wine from the list when the delete button is clicked', () => {
    fail('This test is not implemented yet.');
  });

});
