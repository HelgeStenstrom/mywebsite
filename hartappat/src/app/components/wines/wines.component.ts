import {Component, OnInit, ViewChild} from '@angular/core';
import {WineEntryComponent} from "../wine-entry/wine-entry.component";
import {Observable, of, switchMap} from "rxjs";
import {WineService} from "../../services/backend/wine.service";
import {WineView} from "../../models/wine.model";

@Component({
  selector: 'app-wines',
  templateUrl: './wines.component.html',
  styleUrls: ['./wines.component.css']
})

class WinesComponent implements OnInit {

  wines : WineView[] = [];
  @ViewChild(WineEntryComponent)
  private _wineComponent!: WineEntryComponent;
  winesAsync$: Observable<WineView[]> = of([]);
  constructor(private readonly wineService: WineService,) {}

  ngOnInit(): void {

    this.wineService.getWines()
      .subscribe((w: WineView[]) => {
      this.wines = w;
    });

    this.winesAsync$ = this.wineService.getWines();

  }

  get wineComponent(): WineEntryComponent {
    return this._wineComponent;
  }

  edit(w: WineView) {
    // TODO: Implement edit(wine)
  }

  delete(w: WineView) {

    const deletedWine$ = this.wineService.deleteWine(w);

    this.winesAsync$ = deletedWine$.pipe(
      switchMap(() => this.wineService.getWines())
    );
  }

  addWineToList() {
    const wine = this._wineComponent.getWine();
    const observable = this.wineService.addWine(wine);
    this.winesAsync$ = observable
      .pipe(
        switchMap(() => this.wineService.getWines())
      )
  }
}

export default WinesComponent
