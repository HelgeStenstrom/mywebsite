import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CountriesComponent} from './countries.component';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CountryService} from "../../services/backend/country.service";

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;

  const backendServiceMock = {
    getCountries: () => of([]),
  };

  const countryServiceMock = {
    getCountries: () => of([]),
    addCountry: () => of({ id: 1, name: 'Sverige', isUsed: false }),
    deleteCountry: () => of(void 0),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesComponent],
      imports: [FormsModule],
      providers: [{provide: CountryService, useValue: countryServiceMock}],
    });
    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
