import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {TastingService} from "../../services/backend/tasting.service";
import {WineTastingSummary} from "../../models/tasting.model";
import {Router} from "@angular/router";

@Component({
    selector: 'app-tastings',
    templateUrl: './tastings.component.html',
    styleUrls: ['./tastings.component.css'],
    standalone: false
})
export class TastingsComponent implements OnInit {

  tastings$: Observable<WineTastingSummary[]> = of([]);

  constructor(private readonly service: TastingService,
              private readonly router: Router,
              ) { }

  ngOnInit(): void {

    this.tastings$ = this.service.getTastings();
  }

  openTasting(id: number): void {
    void this.router.navigate(['/tastings', id]);
  }
}
