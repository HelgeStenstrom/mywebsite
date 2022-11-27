import { Component, OnInit } from '@angular/core';
import {BackendService, Grape} from "../backend.service";

@Component({
  selector: 'app-druvor',
  templateUrl: './druvor.component.html',
  styleUrls: ['./druvor.component.css']
})
export class DruvorComponent implements OnInit {
  private service: BackendService;
  grapes: Grape[] = [];

  constructor(service: BackendService) {
    this.service = service;
  }

  ngOnInit(): void {
    this.service.getGrapes()
      .subscribe((g: Grape[]) => {
        this.grapes = g;
      });

    this.service.events.forEach(event => {
      console.log("Druvor fick event från backend: ", event);
      this.service.getGrapes()
        .subscribe((g: Grape[]) => {
          this.grapes = g;
        });
    });

  }

  deleteGrape(grape: Grape) {
    console.log("Would delete: ", grape.name);
    this.service.deleteGrape(grape)
      .subscribe(() => {
        console.log("I think the grape might have been deleted.");
        this.service.getGrapes()
          .subscribe((g: Grape[]) => {
            this.grapes = g;
          })
      });

  }

  editGrape(grape: Grape) {
    console.log("Not implemented");
  }
}
