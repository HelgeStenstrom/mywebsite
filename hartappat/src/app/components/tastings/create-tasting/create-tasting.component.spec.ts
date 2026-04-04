import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateTastingComponent} from './create-tasting.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('CreateTastingComponent', () => {
  let component: CreateTastingComponent;
  let fixture: ComponentFixture<CreateTastingComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateTastingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
    });
    fixture = TestBed.createComponent(CreateTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
