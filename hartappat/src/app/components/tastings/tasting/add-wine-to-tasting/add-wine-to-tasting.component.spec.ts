import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddWineToTastingComponent} from './add-wine-to-tasting.component';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ReactiveFormsModule} from "@angular/forms";
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {provideHttpClient} from "@angular/common/http";

describe('AddWineToTastingComponent', () => {
  let component: AddWineToTastingComponent;
  let fixture: ComponentFixture<AddWineToTastingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,AddWineToTastingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(AddWineToTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
