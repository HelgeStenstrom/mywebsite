import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddWineToTastingComponent} from './add-wine-to-tasting.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule} from "@angular/forms";
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('AddWineToTastingComponent', () => {
  let component: AddWineToTastingComponent;
  let fixture: ComponentFixture<AddWineToTastingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWineToTastingComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(AddWineToTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
