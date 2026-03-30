import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CountriesComponent} from './countries.component';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CountryService} from "../../services/backend/country.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;

  const countryServiceMock = {
    getCountries: () => of([]),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesComponent],
      imports: [FormsModule],
      providers: [{provide: CountryService, useValue: countryServiceMock}],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
