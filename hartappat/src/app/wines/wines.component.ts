import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";

@Component({
  selector: 'app-wines',
  templateUrl: './wines.component.html',
  styleUrls: ['./wines.component.css']
})
export class WinesComponent implements OnInit {
  private service: BackendService;

  constructor(service: BackendService) {
    this.service = service;
  }

  ngOnInit(): void {
    this.service.getData().then(console.log);
    console.log('WinesComponent initialized')

  }

}
