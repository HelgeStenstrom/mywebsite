import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VinmonopoletComponent} from './vinmonopolet.component';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";

describe('VinmonopoletComponent', () => {
  let component: VinmonopoletComponent;
  let fixture: ComponentFixture<VinmonopoletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VinmonopoletComponent ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
