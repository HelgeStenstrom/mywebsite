import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScatterPlotComponent} from './scatter-plot.component';

describe('ScatterPlotComponent', () => {
  let component: ScatterPlotComponent;
  let fixture: ComponentFixture<ScatterPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScatterPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScatterPlotComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
