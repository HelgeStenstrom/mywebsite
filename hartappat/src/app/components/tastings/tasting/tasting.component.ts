import {Component, Input, OnInit} from '@angular/core';
import {BackendService, WineTasting, WineTastingWine} from "../../../services/backend.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-tasting',
  templateUrl: './tasting.component.html',
  styleUrls: ['./tasting.component.css']
})
export class TastingComponent implements OnInit {

  @Input() tasting!: WineTasting;
  wines$!: Observable<WineTastingWine[]>;


  constructor(private readonly service: BackendService) {}

    ngOnInit(): void {
     //this.wines$ = this.service.getTastingWines(this.tasting.id);
    }


}
