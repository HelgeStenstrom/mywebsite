import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateTastingComponent} from './create-tasting.component';
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {provideHttpClient} from "@angular/common/http";

describe('CreateTastingComponent', () => {
  let component: CreateTastingComponent;
  let fixture: ComponentFixture<CreateTastingComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateTastingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(CreateTastingComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
