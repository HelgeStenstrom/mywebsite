import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-alt-druvor',
  templateUrl: './alt-druvor.component.html',
  styleUrls: ['./alt-druvor.component.css']
})
export class AltDruvorComponent implements OnInit {
  grapes: Observable<({ color: string; name: string })[]> = of(
    [
      {name: 'Rondo', color: 'blå'},
      {name: 'Solaris', color: 'grön'}]);

  constructor() { }

  ngOnInit(): void {
  }

}
