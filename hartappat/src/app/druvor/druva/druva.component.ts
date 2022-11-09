import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-druva',
  templateUrl: './druva.component.html',
  styleUrls: ['./druva.component.css']
})
export class DruvaComponent implements OnInit {

  @Input() druvnamn: string = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const paramMap: Observable<ParamMap> = this.route.paramMap;
    paramMap.subscribe(params => {
      if (this.druvnamn === "") {
        this.druvnamn = params.get('druva') as string;
      }
    });
  }

}
