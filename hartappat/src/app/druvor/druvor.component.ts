import { Component, OnInit } from '@angular/core';
import {BackendService, Grape} from "../backend.service";
import {MatDialog} from "@angular/material/dialog";
import {AddGrapeComponent} from "./add-grape/add-grape.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-druvor',
  templateUrl: './druvor.component.html',
  styleUrls: ['./druvor.component.css']
})
export class DruvorComponent implements OnInit {
  grapes: Grape[] = [];

  constructor(private dialog: MatDialog, private service: BackendService) {}

  ngOnInit(): void {
    this.service.getGrapes()
      .subscribe((g: Grape[]) => {
        this.grapes = g;
      });

    this.service.events.forEach(event => {
      // console.log("Druvor fick event från backend: ", event);
      this.service.getGrapes()
        .subscribe((g: Grape[]) => {
          this.grapes = g;
        });
    });

  }

  deleteGrape(grape: Grape) {
    // console.log("Would delete: " + grape.name);
    this.service.deleteGrape(grape)
      .subscribe(() => {
        // console.log("I think the grape might have been deleted.");
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
      // console.log("Grape dialog resultat: ", result);
    })
  }
}
