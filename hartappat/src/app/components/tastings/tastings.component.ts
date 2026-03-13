import {Component, OnInit} from '@angular/core';
import {BackendService, WineTastingSummary} from "../../services/backend/backend.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-tastings',
  templateUrl: './tastings.component.html',
  styleUrls: ['./tastings.component.css']
})
export class TastingsComponent implements OnInit {

  tastings$: Observable<WineTastingSummary[]> = of([]);

  constructor(private readonly service: BackendService) { }

  ngOnInit(): void {

    this.tastings$ = this.service.getTastings();
  }

}
