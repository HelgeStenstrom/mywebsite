import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ScatterPlotComponent} from './scatter-plot.component';
import Chart from 'chart.js/auto';

describe('ScatterPlotComponent', () => {
  let component: ScatterPlotComponent;
  let fixture: ComponentFixture<ScatterPlotComponent>;

  beforeEach(async () => {
    (Chart as unknown as jest.Mock).mockClear();

    await TestBed.configureTestingModule({
      imports: [ScatterPlotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should have a canvas element', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  test('creates a Chart instance on init', () => {
    expect(Chart).toHaveBeenCalled();
  });
});
