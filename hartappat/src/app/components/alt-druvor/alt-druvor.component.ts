import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {BackendService,} from "../../services/backend/backend.service";
import {Grape} from "../../models/common.model";

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
