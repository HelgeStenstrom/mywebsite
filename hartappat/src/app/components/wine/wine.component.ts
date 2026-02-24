import {Component, OnInit} from '@angular/core';
import {BackendService, CountryApi, WineCreate, WineTypeApi} from "../../services/backend.service";

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

  getWine(): WineCreate {
    if (!this.countryId || !this.wineTypeId) {
      throw new Error("Country and wine type must be selected");
    }

    return {
      name:this.wineName,
      countryId:this.countryId,
      systembolaget:this.systemNumber,
      wineTypeId:this.wineTypeId,
      volume: 749};
  }

}
