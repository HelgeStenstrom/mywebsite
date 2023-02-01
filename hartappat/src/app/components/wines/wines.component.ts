import { Component, OnInit } from '@angular/core';
import {BackendService, Wine} from "../../services/backend.service";

@Component({
  selector: 'app-wines',
  templateUrl: './wines.component.html',
  styleUrls: ['./wines.component.css']
})
export class WinesComponent implements OnInit {
  private service: BackendService;
  wines : Wine[] = [];



  constructor(service: BackendService) {
    this.service = service;

  }

  ngOnInit(): void {
    this.service.getWines()
      .subscribe((w: Wine[]) => {
      // console.log("Wines: ", w);
      this.wines = w;

    });
    // console.log('WinesComponent initialized')

  }

}
