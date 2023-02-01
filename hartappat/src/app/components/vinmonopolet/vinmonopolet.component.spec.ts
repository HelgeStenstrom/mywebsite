import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VinmonopoletComponent} from './vinmonopolet.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('VinmonopoletComponent', () => {
  let component: VinmonopoletComponent;
  let fixture: ComponentFixture<VinmonopoletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ VinmonopoletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinmonopoletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
