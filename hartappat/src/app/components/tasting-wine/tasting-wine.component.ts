import {Component, OnInit} from '@angular/core';
import {WineTastingWine} from "../../models/tasting.model";
import {ActivatedRoute} from "@angular/router";
import {TastingService} from "../../services/backend/tasting.service";
import {WineApi} from "../../models/wine.model";
import {WineService} from "../../services/backend/wine.service";

@Component({
  selector: 'app-tasting-wine',
  imports: [],
  templateUrl: './tasting-wine.component.html',
  styleUrl: './tasting-wine.component.css',
})
export class TastingWineComponent implements OnInit {
  protected tastingWine:WineTastingWine = {id: -1, wineId: -1, position:-1, purchasePrice: -1};
  protected wine: WineApi = {
    country: {id: 0, name: "Hardcoded country"},
    id: 0,
    isNonVintage: false,
    isUsed: false,
    name: "Hardcoded wine",
    vintageYear: -1,
    wineType: {id: 0, name: "hardcoded wine type"}

  }

  constructor(
    private readonly tastingService: TastingService,
    private readonly route: ActivatedRoute,
    private readonly wineService: WineService,
  ) {}

  ngOnInit(): void {
    const tastingId = Number(this.route.snapshot.paramMap.get('id'));
    const tastingWineId = Number(this.route.snapshot.paramMap.get('tastingWineId'));

    this.tastingService.getTastingWine(tastingId, tastingWineId)
      .subscribe(tastingWine => {
        this.tastingWine = tastingWine;
        this.wineService.getWine(tastingWine.wineId).subscribe(wine => {
          this.wine = wine;
        })
      });

    }
}
