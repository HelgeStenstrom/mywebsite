import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WinesComponent} from './wines.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('WinesComponent', () => {
  let component: WinesComponent;
  let fixture: ComponentFixture<WinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ WinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
