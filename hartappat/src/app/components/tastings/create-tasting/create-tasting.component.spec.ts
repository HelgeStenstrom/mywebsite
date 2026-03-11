import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateTastingComponent} from './create-tasting.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('CreateTastingComponent', () => {
  let component: CreateTastingComponent;
  let fixture: ComponentFixture<CreateTastingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTastingComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CreateTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
