import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Grape} from "../../models/common.model";
import {GrapeService} from "../../services/backend/grape.service";

@Component({
    selector: 'app-alt-druvor',
    templateUrl: './alt-druvor.component.html',
    styleUrls: ['./alt-druvor.component.css'],
    standalone: false
})
export class AltDruvorComponent implements OnInit {
  grapes: Observable<(Grape)[]>;

  constructor(private service: GrapeService) {
    this.grapes = service.getGrapes();
  }

  ngOnInit(): void {
    // Nothing yet
  }

  deleteGrape(grape: Grape) : Observable<Grape[]> {

    return this.service.deleteGrape(grape.id)
      .pipe(() => this.service.getGrapes());

  }
}
