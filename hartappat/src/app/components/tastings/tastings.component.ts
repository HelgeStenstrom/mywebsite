import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {TastingService} from "../../services/backend/tasting.service";
import {WineTastingSummary} from "../../models/tasting.model";

@Component({
  selector: 'app-tastings',
  templateUrl: './tastings.component.html',
  styleUrls: ['./tastings.component.css']
})
export class TastingsComponent implements OnInit {

  tastings$: Observable<WineTastingSummary[]> = of([]);

  constructor(private readonly service: TastingService) { }

  ngOnInit(): void {

    this.tastings$ = this.service.getTastings();
  }

}
