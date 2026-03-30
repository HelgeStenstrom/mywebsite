import {Component, OnInit, ViewChild} from '@angular/core';
import {WineEntryComponent} from "../wine-entry/wine-entry.component";
import {WineService} from "../../services/backend/wine.service";
import {WineView} from "../../models/wine.model";
import {Router, RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-wines',
  templateUrl: './wines.component.html',
  styleUrls: ['./wines.component.css'],
  imports: [DatePipe, MatIconModule, WineEntryComponent, MatIconButton, RouterLink],
})

class WinesComponent implements OnInit {

  wines: WineView[] = [];
  @ViewChild(WineEntryComponent)
  private readonly _wineComponent!: WineEntryComponent;
  sortColumn: keyof WineView | '' = '';
  sortAscending: boolean = true;

  columns: { key: keyof WineView; label: string }[] = [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Namn'},
    {key: 'country', label: 'Land'},
    {key: 'wineType', label: 'Typ'},
    {key: 'vintage', label: 'Årgång'},
    {key: 'volume', label: 'Volym'},
    {key: 'createdAt', label: 'Datum'},
    {key: 'lastTasted', label: 'Senast provat'},
    {key: 'systembolaget', label: 'Systembolaget'},
  ];

  constructor(private readonly wineService: WineService,
              private readonly router: Router,) {
  }

  ngOnInit(): void {

    this.wineService.getWines()
      .subscribe((w: WineView[]) => {
        this.wines = w;
      });

  }

  edit(w: WineView) {
    void this.router.navigate(['/wines', w.id]);
  }

  delete(w: WineView) {
    this.wineService.deleteWine(w).subscribe(() => {
      this.wineService.getWines().subscribe(wines => {
        this.wines = wines;
      });
    });
  }

  onWineSaved(): void {
    this.wineService.getWines().subscribe(wines => {
      this.wines = wines;
    });
  }

  sortBy(column: keyof WineView): void {
    if (this.sortColumn === column) {
      if (this.sortAscending) {
        this.sortAscending = false;
      } else {
        this.sortColumn = '';
      }
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
  }


  sortedWines(): WineView[] {
    if (!this.sortColumn) return this.wines;
    return [...this.wines].sort((a, b) => {
      const aVal = this.sortColumn ? (a[this.sortColumn] ?? '') : '';
      const bVal = this.sortColumn ? (b[this.sortColumn] ?? '') : '';
      if (aVal < bVal) return this.sortAscending ? -1 : 1;
      if (aVal > bVal) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }


}


export default WinesComponent
