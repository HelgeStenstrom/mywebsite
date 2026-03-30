import {Component, Input, OnInit} from '@angular/core';
import {WineService} from "../../services/backend/wine.service";
import {GrapeService} from "../../services/backend/grape.service";
import {WineGrape} from "../../models/wine.model";
import {Observable, of} from "rxjs";
import {Grape} from "../../models/common.model";
import {AsyncPipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-wine-grapes',
  templateUrl: './wine-grapes.component.html',
  styleUrls: ['./wine-grapes.component.css'],
  imports: [AsyncPipe,MatIconModule, FormsModule,],
})
export class WineGrapesComponent implements OnInit {
  @Input() wineId!: number;

  wineGrapes$: Observable<WineGrape[]> = of([]);
  searchTerm = '';
  allGrapes: Grape[] = [];
  filteredGrapes: Grape[] = [];
  selectedGrapeId?: number;
  percentage?: number;

  constructor(private readonly wineService: WineService,
              private readonly grapeService: GrapeService,) {
  }

  ngOnInit(): void {
    this.wineGrapes$ = this.wineService.getWineGrapes(this.wineId);
    this.grapeService.getGrapes().subscribe(grapes => {
      this.allGrapes = grapes;
    });


  }


  updateFilter() {
    this.filteredGrapes = this.allGrapes.filter(
      grape => grape.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase()));
  }


  addGrape(): void {
    if (!this.selectedGrapeId) return;

    const toCreate = {
      grapeId: this.selectedGrapeId,
      percentage: this.percentage,
    };
    this.wineService
      .addWineGrape(this.wineId, toCreate)
      .subscribe(() => {
        this.wineGrapes$ = this.wineService.getWineGrapes(this.wineId);
      });
  }


  protected deleteGrape(id: number) {
    this.wineService.deleteWineGrape(this.wineId, id)
      .subscribe(() => {
        this.wineGrapes$ = this.wineService.getWineGrapes(this.wineId);
      })
  }

  getGrapeName(grapeId: number): string {
    return this.allGrapes.find(g => g.id === grapeId)?.name ?? '?';
  }

  getGrapeColor(grapeId: number): string {
    return this.allGrapes.find(g => g.id === grapeId)?.color ?? '?';
  }

}
