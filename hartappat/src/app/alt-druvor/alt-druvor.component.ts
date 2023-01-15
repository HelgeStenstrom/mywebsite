import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";
import {BackendService, Grape} from "../backend.service";

@Component({
  selector: 'app-alt-druvor',
  templateUrl: './alt-druvor.component.html',
  styleUrls: ['./alt-druvor.component.css']
})
export class AltDruvorComponent implements OnInit {
  grapes: Observable<(Grape)[]> = of(
    [
      {name: 'Rondo', color: 'blå'},
      {name: 'Solaris', color: 'grön'}]);

  constructor(private service: BackendService) { }

  ngOnInit(): void {
  }

}
