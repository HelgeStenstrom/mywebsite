import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddGrapeComponent} from "./add-grape/add-grape.component";
import {Observable, of, switchMap} from "rxjs";
import {Grape} from "../../models/common.model";
import {GrapeService} from "../../services/backend/grape.service";

@Component({
    selector: 'app-druvor',
    templateUrl: './druvor.component.html',
    styleUrls: ['./druvor.component.css'],
    standalone: false
})
export class DruvorComponent implements OnInit {
  grapes$: Observable<Grape[]> = of([]);

  constructor(private readonly dialog: MatDialog, private readonly service: GrapeService) {}

  ngOnInit(): void {
    this.grapes$ = this.service.getGrapes();
  }

  onGrapeAdded(grape: Grape) {
    this.grapes$ = this.service.getGrapes();
  }

  deleteGrape(grape: Grape) {
    const deletedGrape$ = this.service.deleteGrape(grape.id);

    this.grapes$ = deletedGrape$.pipe(
      switchMap(() => this.service.getGrapes())
    );
  }

  editGrape(grape: Grape) {
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.dialog.open(AddGrapeComponent, {data: grape});
    this.grapes$ = dialogRef.afterClosed().pipe(
      switchMap(() => this.service.getGrapes())
    )
  }
}
