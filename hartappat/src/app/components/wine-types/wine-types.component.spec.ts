import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WineTypesComponent} from './wine-types.component';
import {BackendService} from '../../services/backend/backend.service';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';

describe('WineTypesComponent', () => {
  let component: WineTypesComponent;
  let fixture: ComponentFixture<WineTypesComponent>;

  const backendServiceMock = {
    getWineTypes: () => of([]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineTypesComponent],
      imports: [FormsModule],
      providers: [{provide: BackendService, useValue: backendServiceMock}]
    });
    fixture = TestBed.createComponent(WineTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
