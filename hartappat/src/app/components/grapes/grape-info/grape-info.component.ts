import {Component, OnInit} from '@angular/core';
import {GrapeService} from "../../../services/backend/grape.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-grape-info',
  imports: [],
  templateUrl: './grape-info.component.html',
  styleUrl: './grape-info.component.css',
})
export class GrapeInfoComponent implements OnInit{
  protected grapeName!: string;

  constructor(
    private readonly grapeService: GrapeService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Grape id: ", id);
    this.grapeService.getGrape(id)
      .subscribe(grape => {
        this.grapeName = grape.name;
      })
  }

}
