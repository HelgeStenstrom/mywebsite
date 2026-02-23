import {Component, OnInit} from '@angular/core';
import {BackendService, CountryApi, WineTypeApi, WineView} from "../../services/backend.service";

@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
  styleUrls: ['./wine.component.css']
})
export class WineComponent implements OnInit {
  countries: CountryApi[] = [];
  wineTypes: WineTypeApi[] = [];

  wineName = "";
  typeSelect = "Annat";
  countryId?: number;
  wineTypeId?: number;
  systemNumber?: number;

  constructor(private backendService: BackendService) {
  }

  ngOnInit(): void {
    this.backendService.getCountries().subscribe(countries => {
      this.countries = countries;
    });

    this.backendService.getWineTypes().subscribe(types => {
      this.wineTypes = types;
    });
  }

  getWine(): WineView {
    return {id: 3, name:this.wineName, country:'land', systembolaget:this.systemNumber, wineType:this.typeSelect, volume: 749};
  }

}
