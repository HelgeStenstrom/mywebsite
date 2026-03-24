import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CountriesComponent} from './countries.component';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CountryService} from "../../services/backend/country.service";

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
    });
    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
