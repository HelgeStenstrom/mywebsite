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
      .then((g:Grape[]) => {
        console.log("Druva: ", g);
        this.grapes = g;
      })
  }
}
