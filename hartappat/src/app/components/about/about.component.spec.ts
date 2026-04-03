import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutComponent} from './about.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],

      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
