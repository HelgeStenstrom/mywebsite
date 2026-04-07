import {Component, OnInit} from '@angular/core';
import {WineTastingWine} from "../../models/tasting.model";
import {ActivatedRoute} from "@angular/router";
import {TastingService} from "../../services/backend/tasting.service";

@Component({
  selector: 'app-tasting-wine',
  imports: [],
  templateUrl: './tasting-wine.component.html',
  styleUrl: './tasting-wine.component.css',
})
export class TastingWineComponent implements OnInit {
  protected tastingWine:WineTastingWine = {id: -1, wineId: -1, position:-1, purchasePrice: -1};

  constructor(
    private readonly tastingService: TastingService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const tastingId = Number(this.route.snapshot.paramMap.get('id'));
    const wineId = Number(this.route.snapshot.paramMap.get('tastingWineId'));

    this.tastingService.getTastingWine(tastingId, wineId)
      .subscribe(tastingWine => {
        this.tastingWine = tastingWine;
      });

    }
}
