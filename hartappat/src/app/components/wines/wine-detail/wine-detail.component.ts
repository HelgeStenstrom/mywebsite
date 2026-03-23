import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WineService} from "../../../services/backend/wine.service";
import {WineApi} from "../../../models/wine.model";

@Component({
    selector: 'app-wine-detail',
    templateUrl: './wine-detail.component.html',
    styleUrls: ['./wine-detail.component.css'],
    standalone: false
})
export class WineDetailComponent implements OnInit {
  wineId!: number;

  wine?: WineApi;

  constructor(
    private readonly wineService: WineService,
    private readonly route: ActivatedRoute) {}



  ngOnInit(): void {
    this.wineId = Number(this.route.snapshot.paramMap.get('id'))

    this.wineService.getWine(this.wineId).subscribe(wine => {
      this.wine = wine;
    });
  }

  protected onWineSaved(): void {
    this.wineService.getWine(this.wineId).subscribe(wine => {
      this.wine = wine;
    });
  }
}
