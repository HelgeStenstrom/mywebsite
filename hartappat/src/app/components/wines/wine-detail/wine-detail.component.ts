import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WineService} from "../../../services/backend/wine.service";
import {WineApi} from "../../../models/wine.model";
import {WineEntryComponent} from "../../wine-entry/wine-entry.component";
import {WineGrapesComponent} from "../../wine-grapes/wine-grapes.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-wine-detail',
  templateUrl: './wine-detail.component.html',
  styleUrls: ['./wine-detail.component.css'],
  imports: [WineEntryComponent, WineGrapesComponent, DatePipe],
})
export class WineDetailComponent implements OnInit {
  wineId!: number;

  wine?: WineApi;

  constructor(
    private readonly wineService: WineService,
    private readonly route: ActivatedRoute) {
  }


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
