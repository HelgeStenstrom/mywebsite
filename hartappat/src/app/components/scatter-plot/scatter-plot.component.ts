import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';
import {ScatterPoint} from "../../models/graphics.model";

@Component({
  selector: 'app-scatter-plot',
  imports: [],
  templateUrl: './scatter-plot.component.html',
  styleUrl: './scatter-plot.component.css',
})
export class ScatterPlotComponent implements OnInit, OnChanges {

  private chart!: Chart;

  @Input() points: ScatterPoint[] = [];
  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [{
          data: this.points.map(p => ({x: p.price, y: p.score})),
        }],
      },
      options: {
        animation: false,
        responsive: false,
        maintainAspectRatio: false,
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.chart?.data?.datasets?.[0]) {
      this.chart.data.datasets[0].data = this.points.map(p => ({x: p.price, y: p.score}));
      this.chart.update();
    }
  }

}
