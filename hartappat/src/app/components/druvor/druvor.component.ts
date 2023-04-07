import { Component, OnInit } from '@angular/core';
import {BackendService, Grape} from "../../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {AddGrapeComponent} from "./add-grape/add-grape.component";
import {Observable, of, Subscription} from "rxjs";

@Component({
  selector: 'app-druvor',
  templateUrl: './druvor.component.html',
  styleUrls: ['./druvor.component.css']
})
export class DruvorComponent implements OnInit {
  grapes: Grape[] = [];

  constructor(private dialog: MatDialog, private service: BackendService) {}

  ngOnInit(): void {
    const grapes1: Observable<Grape[]> = this.service.getGrapes();
    grapes1.subscribe((g: Grape[]) => {
      this.grapes = g;
    });

    this.service.events.forEach(event => {
      grapes1.subscribe((g: Grape[]) => {
        this.grapes = g;
      });
    });

  }

  deleteGrape(grape: Grape) {
    this.service.deleteGrape(grape)
      .subscribe(() => {
        this.service.getGrapes()
          .subscribe((g: Grape[]) => {
            this.grapes = g;
          })
      });
  }

  editGrape(grape: Grape) {
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.dialog.open(AddGrapeComponent, {data: grape});
    dialogRef.afterClosed().subscribe(result => {
    })
  }
}
