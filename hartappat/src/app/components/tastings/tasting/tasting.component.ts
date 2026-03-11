import {Component, Input, OnInit} from '@angular/core';
import {BackendService, WineTasting} from "../../../services/backend.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-tasting',
  templateUrl: './tasting.component.html',
  styleUrls: ['./tasting.component.css']
})
export class TastingComponent implements OnInit {

  @Input() tasting!: WineTasting;
  fullTasting$!: Observable<WineTasting>;


  constructor(private readonly service: BackendService) {}

    ngOnInit(): void {
    this.fullTasting$ = this.service.getTasting(this.tasting.id);
    }


}
