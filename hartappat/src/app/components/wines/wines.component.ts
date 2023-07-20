import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendService, Wine} from "../../services/backend.service";
import {WineComponent} from "../wine/wine.component";
import { Observable, of, switchMap } from "rxjs";

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
  winesAsync$: Observable<Wine[]> = of([]);
  constructor(service: BackendService) {
    this.service = service;

  }

  ngOnInit(): void {

    this.service.getWines()
      .subscribe((w: Wine[]) => {
      this.wines = w;
    });

    this.winesAsync$ = this.service.getWines();

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
    const observable = this.service.addWine(wine);
    this.winesAsync$ = observable
      .pipe(
        switchMap(() => this.service.getWines())
      )
  }
}
