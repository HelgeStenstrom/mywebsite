import { Component, OnInit } from '@angular/core';
import {BackendService, Grape} from "../services/backend.service";
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
  asyncGrapes: Observable<Grape[]> = of([{name:"Nisse", color:"lila"}]);

  constructor(private dialog: MatDialog, private service: BackendService) {}

  ngOnInit(): void {
    const grapes1: Observable<Grape[]> = this.service.getGrapes();
    grapes1.subscribe((g: Grape[]) => {
      this.grapes = g;
    });

    this.asyncGrapes = grapes1;

    this.service.events.forEach(event => {
      // console.log("Druvor fick event från backend: ", event);
      grapes1.subscribe((g: Grape[]) => {
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
