import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateTastingComponent} from './create-tasting.component';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {provideHttpClient} from "@angular/common/http";

describe('CreateTastingComponent', () => {
  let component: CreateTastingComponent;
  let fixture: ComponentFixture<CreateTastingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTastingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(CreateTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
