import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WineInfoComponent} from './wine-info.component';

describe('WineInfoComponent', () => {
  let component: WineInfoComponent;
  let fixture: ComponentFixture<WineInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WineInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WineInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
