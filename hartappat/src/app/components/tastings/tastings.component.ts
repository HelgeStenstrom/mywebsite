import {Component, OnInit} from '@angular/core';
import {BackendService, WineTasting} from "../../services/backend.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-tastings',
  templateUrl: './tastings.component.html',
  styleUrls: ['./tastings.component.css']
})
export class TastingsComponent implements OnInit {

  tastings$: Observable<WineTasting[]> = of([]);

  constructor(private service: BackendService) { }

  ngOnInit(): void {

    this.tastings$ = this.service.getTastings();
  }

}
