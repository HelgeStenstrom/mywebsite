import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-wine-detail',
  templateUrl: './wine-detail.component.html',
  styleUrls: ['./wine-detail.component.css']
})
export class WineDetailComponent implements OnInit {
  wineId!: number;

  constructor(private readonly route: ActivatedRoute) {}



  ngOnInit(): void {
    this.wineId = Number(this.route.snapshot.paramMap.get('id'))
  }

}
