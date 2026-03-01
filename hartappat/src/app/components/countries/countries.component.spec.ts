import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CountriesComponent} from './countries.component';
import {BackendService} from '../../services/backend.service';
import {of} from 'rxjs';

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;

  const backendServiceMock = {
    getCountries: () => of([]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesComponent],
      providers: [{provide: BackendService, useValue: backendServiceMock}],
    });
    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
