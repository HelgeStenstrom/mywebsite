import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {BackendService, Grape} from "../services/backend.service";

@Component({
  selector: 'app-alt-druvor',
  templateUrl: './alt-druvor.component.html',
  styleUrls: ['./alt-druvor.component.css']
})
export class AltDruvorComponent implements OnInit {
  grapes: Observable<(Grape)[]>;

  constructor(private service: BackendService) {
    this.grapes = service.getGrapes();
  }

  ngOnInit(): void {
    // Nothing yet
  }

  deleteGrape(grape: Grape) : Observable<Grape[]> {

    return this.service.deleteGrape(grape)
      .pipe(() => this.service.getGrapes());

  }
}
