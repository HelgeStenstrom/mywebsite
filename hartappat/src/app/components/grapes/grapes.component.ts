import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddGrapeComponent} from "./add-grape/add-grape.component";
import {Grape} from "../../models/common.model";
import {GrapeService} from "../../services/backend/grape.service";

@Component({
    selector: 'app-grapes',
    templateUrl: './grapes.component.html',
    styleUrls: ['./grapes.component.css'],
    standalone: false
})
export class GrapesComponent implements OnInit {
  grapes: Grape[] = [];
  sortColumn: keyof Grape | '' = '';
  sortAscending: boolean = true;

  columns: { key: keyof Grape; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Namn' },
    { key: 'color', label: 'Färg' },
  ];

  constructor(private readonly dialog: MatDialog, private readonly service: GrapeService) {}

  ngOnInit(): void {
    this.service.getGrapes().subscribe(grapes => {
      this.grapes = grapes;
    });
  }

  onGrapeAdded(grape: Grape) {
    this.service.getGrapes().subscribe(grapes => {
      this.grapes = grapes;
    });
  }

  deleteGrape(grape: Grape) {
    this.service.deleteGrape(grape.id).subscribe(() => {
      this.service.getGrapes().subscribe(grapes => {
        this.grapes = grapes;
      });
    });
  }

  editGrape(grape: Grape) {
    const dialogRef = this.dialog.open(AddGrapeComponent, {data: grape});
    dialogRef.afterClosed().subscribe(() => {
      this.service.getGrapes().subscribe(grapes => {
        this.grapes = grapes;
      });
    });
  }

  sortBy(column: keyof Grape): void {
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

  sortedGrapes(): Grape[] {
    if (!this.sortColumn) return this.grapes;
    return [...this.grapes].sort((a, b) => {
      const aVal = a[this.sortColumn as keyof Grape] ?? '';
      const bVal = b[this.sortColumn as keyof Grape] ?? '';
      if (aVal < bVal) return this.sortAscending ? -1 : 1;
      if (aVal > bVal) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

}
