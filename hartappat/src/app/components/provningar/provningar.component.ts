import {Component, OnInit} from '@angular/core';
import {BackendService, Tasting} from "../../services/backend.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-provningar',
  templateUrl: './provningar.component.html',
  styleUrls: ['./provningar.component.css']
})
export class ProvningarComponent implements OnInit {

  tastings$: Observable<Tasting[]> = of([]);

  constructor(private service: BackendService) { }

  ngOnInit(): void {

    this.tastings$ = this.service.getTastings();
  }

}
