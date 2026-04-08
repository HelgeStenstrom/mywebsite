import {Component, OnInit} from '@angular/core';
import {GrapeService} from "../../../services/backend/grape.service";
import {ActivatedRoute} from "@angular/router";
import {WineApi} from "../../../models/wine.model";

@Component({
  selector: 'app-grape-info',
  imports: [],
  templateUrl: './grape-info.component.html',
  styleUrl: './grape-info.component.css',
})
export class GrapeInfoComponent implements OnInit{
  protected grapeName!: string;
  protected winesCount: number = -1;
  protected wines: WineApi[] = [];

  constructor(
    private readonly grapeService: GrapeService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.grapeService.getGrape(id)
      .subscribe(grape => {
        this.grapeName = grape.name;
      });

    this.grapeService.getWinesByGrapeId(id).subscribe(wines => {

      this.winesCount = wines.length;
      this.wines = wines;
    });

  }

}
