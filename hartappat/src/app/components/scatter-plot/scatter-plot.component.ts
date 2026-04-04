import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-scatter-plot',
  imports: [],
  templateUrl: './scatter-plot.component.html',
  styleUrl: './scatter-plot.component.css',
})
export class ScatterPlotComponent implements OnInit{

  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    new Chart(this.canvasRef.nativeElement, {
      type: 'scatter',
      data: {datasets: []},
    });
  }
}
