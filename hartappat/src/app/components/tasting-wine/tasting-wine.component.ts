import {Component, OnInit} from '@angular/core';
import {WineTasting, WineTastingWine} from "../../models/tasting.model";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TastingService} from "../../services/backend/tasting.service";
import {WineApi} from "../../models/wine.model";
import {WineService} from "../../services/backend/wine.service";

@Component({
  selector: 'app-tasting-wine',
  imports: [
    RouterLink
  ],
  templateUrl: './tasting-wine.component.html',
  styleUrl: './tasting-wine.component.css',
})
export class TastingWineComponent implements OnInit {
  protected tastingWine!: WineTastingWine;
  protected wine!: WineApi;
  protected tasting!: WineTasting;


  constructor(
    private readonly tastingService: TastingService,
    private readonly route: ActivatedRoute,
    private readonly wineService: WineService,
  ) {
  }

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

    this.tastingService.getTasting(tastingId).subscribe(
      tasting => {
        this.tasting = tasting;
      }
    );
  }
}
