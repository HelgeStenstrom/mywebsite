import {Component, Input, OnInit} from '@angular/core';
import {BackendService, WineTasting} from "../../../services/backend.service";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-tasting',
  templateUrl: './tasting.component.html',
  styleUrls: ['./tasting.component.css']
})
export class TastingComponent implements OnInit {

  @Input() tasting?: WineTasting;
  fullTasting$!: Observable<WineTasting>;


  constructor(
    private readonly service: BackendService,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const id = this.tasting?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.fullTasting$ = this.service.getTasting(id);
  }


}
