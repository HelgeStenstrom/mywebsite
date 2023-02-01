import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinprovningComponent } from './vinprovning.component';

describe('VinprovningComponent', () => {
  let component: VinprovningComponent;
  let fixture: ComponentFixture<VinprovningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VinprovningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinprovningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
