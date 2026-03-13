import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WineTypesComponent} from './wine-types.component';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {WineTypeService} from "../../services/backend/wine-type.service";

describe('WineTypesComponent', () => {
  let component: WineTypesComponent;
  let fixture: ComponentFixture<WineTypesComponent>;

  const serviceMock = {
    getWineTypes: () => of([]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineTypesComponent],
      imports: [FormsModule],
      providers: [{provide: WineTypeService, useValue: serviceMock}]
    });
    fixture = TestBed.createComponent(WineTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
