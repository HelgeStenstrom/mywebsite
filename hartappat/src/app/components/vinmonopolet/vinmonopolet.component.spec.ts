import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VinmonopoletComponent} from './vinmonopolet.component';
import {VinmonopoletService} from "../../services/vinmonopolet.service";
import {of} from "rxjs";

describe('VinmonopoletComponent', () => {
  let component: VinmonopoletComponent;
  let fixture: ComponentFixture<VinmonopoletComponent>;

  const vinmonopoletServiceMock = {
    getProductDetails: jest.fn().mockReturnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VinmonopoletComponent ],
      providers: [
        {provide: VinmonopoletService, useValue: vinmonopoletServiceMock},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinmonopoletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
