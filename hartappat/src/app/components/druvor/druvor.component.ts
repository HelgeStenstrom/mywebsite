import { Component, OnInit } from '@angular/core';
import {BackendService, Grape} from "../../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {AddGrapeComponent} from "./add-grape/add-grape.component";
import { Observable, of, switchMap } from "rxjs";

@Component({
  selector: 'app-druvor',
  templateUrl: './druvor.component.html',
  styleUrls: ['./druvor.component.css']
})
export class DruvorComponent implements OnInit {
  grapes$: Observable<Grape[]> = of([]);

  constructor(private dialog: MatDialog, private service: BackendService) {}

  ngOnInit(): void {
    this.grapes$ = this.service.getGrapes();
  }

  onGrapeAdded(grape: Grape) {
    this.grapes$ = this.service.getGrapes();
  }

  deleteGrape(grape: Grape) {
    const deletedGrape$ = this.service.deleteGrape(grape);

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
