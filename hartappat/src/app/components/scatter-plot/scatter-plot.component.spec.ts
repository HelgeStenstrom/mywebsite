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
  });

  describe('Basic creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    test('should have a canvas element', () => {
      const canvas = fixture.nativeElement.querySelector('canvas');
      expect(canvas).toBeTruthy();
    });

    test('creates a Chart instance on init', () => {
      fixture.detectChanges();
      expect(Chart).toHaveBeenCalled();
    });

  })

  describe('Points on chart', () => {
    test('passes points to Chart as dataset', () => {
      component.points = [
        {position: 1, price: 100, score: 15, label: ''},
        {position: 2, price: 200, score: 18, label: ''},
      ];
      fixture.detectChanges();

      const chartConfig = (Chart as unknown as jest.Mock).mock.calls[0][1];
      expect(chartConfig.data.datasets[0].data).toEqual([
        {x: 100, y: 15},
        {x: 200, y: 18},
      ]);

    });

    test('updates Chart data when points change', () => {
      fixture.detectChanges();

      fixture.componentRef.setInput('points', [
        {position: 1, price: 100, score: 15},
        {position: 2, price: 200, score: 18},
      ]);

      fixture.detectChanges();

      const chartInstance = (Chart as unknown as jest.Mock).mock.results[0].value;
      expect(chartInstance.data.datasets[0].data).toEqual([
        {x: 100, y: 15},
        {x: 200, y: 18},
      ]);
    });

  })


  describe('Chart labels', () => {

    test('configures datalabels plugin with point labels', () => {
      fixture.componentRef.setInput('points', [
        {position: 1, price: 100, score: 15, label: 'Château Margaux'},
        {position: 2, price: 200, score: 18, label: 'Riesling'},
      ]);
      fixture.detectChanges();

      const chartConfig = (Chart as unknown as jest.Mock).mock.calls[0][1];
      const formatter = chartConfig.options.plugins.datalabels.formatter;
      expect(formatter({x: 100, y: 15}, {dataIndex: 0})).toEqual('Château Margaux');
      expect(formatter({x: 200, y: 18}, {dataIndex: 1})).toEqual('Riesling');
    });

  })


;
});
