import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddWineToTastingComponent} from './add-wine-to-tasting.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {WineService} from "../../../../services/backend/wine.service";
import {of} from "rxjs";

describe('AddWineToTastingComponent', () => {
  let component: AddWineToTastingComponent;
  let fixture: ComponentFixture<AddWineToTastingComponent>;

  const wineServiceMock = {
    getWines: jest.fn().mockReturnValue(of([])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,AddWineToTastingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: WineService, useValue: wineServiceMock },
      ],
    });
    fixture = TestBed.createComponent(AddWineToTastingComponent);
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
