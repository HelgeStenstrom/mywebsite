import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendService, Wine} from "../../services/backend.service";
import {WineComponent} from "../wine/wine.component";

@Component({
  selector: 'app-wines',
  templateUrl: './wines.component.html',
  styleUrls: ['./wines.component.css']
})

export class WinesComponent implements OnInit {
  private service: BackendService;
  wines : Wine[] = [];
  @ViewChild(WineComponent)
  private _wineComponent!: WineComponent;
  constructor(service: BackendService) {
    this.service = service;

  }

  ngOnInit(): void {
    this.service.getWines()
      .subscribe((w: Wine[]) => {
      this.wines = w;

    });

  }

  get wineComponent(): WineComponent {
    return this._wineComponent;
  }

  edit(w: Wine) {

  }

  delete(w: Wine) {

  }

  addWineToList() {
    const wine = this._wineComponent.getWine();
    console.log("Called WineComponent.getWine(), got ", wine);
    this.service.addWine(wine);
  }
}
