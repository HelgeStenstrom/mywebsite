import {Component, OnInit} from '@angular/core';
import {WineService} from "../../../services/backend/wine.service";
import {ActivatedRoute} from "@angular/router";
import {WineApi} from "../../../models/wine.model";
import {Title} from "@angular/platform-browser";
import {GrapeService} from "../../../services/backend/grape.service";


@Component({
  selector: 'app-wine-info',
  imports: [],
  templateUrl: './wine-info.component.html',
  styleUrl: './wine-info.component.css',
})
export class WineInfoComponent implements OnInit {
  protected wine!: WineApi;
  protected grapeInfos: WineGrapeInfo[] = [];

  constructor(
    private readonly wineService: WineService,
    private readonly grapeService: GrapeService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.wineService.getWine(id).subscribe(wine => {
      this.wine = wine;
      const name = wine.name;
      this.titleService.setTitle(name);

      this.wine.grapes.forEach(wg => {
        this.grapeService
          .getGrape(wg.grapeId)
          .subscribe(g => {
            this.grapeInfos.push({
              name: g.name,
              color: g.color,
              percentage: wg.percentage,
            })
          });
      })
    })
  }
}


interface WineGrapeInfo {
  name: string;
  color: string;
  percentage: number | null;
}
