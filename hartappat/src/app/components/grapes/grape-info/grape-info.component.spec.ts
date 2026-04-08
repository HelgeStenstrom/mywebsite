import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GrapeInfoComponent} from './grape-info.component';

describe('GrapeInfoComponent', () => {
  let component: GrapeInfoComponent;
  let fixture: ComponentFixture<GrapeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrapeInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrapeInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
