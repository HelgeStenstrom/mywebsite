import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProvningarComponent} from './provningar.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ProvningarComponent', () => {
  let component: ProvningarComponent;
  let fixture: ComponentFixture<ProvningarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ProvningarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvningarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
