import {Component, Input, OnInit} from '@angular/core';
import {CountryService} from "../../services/backend/country.service";
import {WineTypeService} from "../../services/backend/wine-type.service";
import {CountryApi, WineTypeApi} from "../../models/common.model";
import {WineCreate} from "../../models/wine.model";
import {WineService} from "../../services/backend/wine.service";

@Component({
  selector: 'app-wine-entry',
  templateUrl: './wine-entry.component.html',
  styleUrls: ['./wine-entry.component.css']
})
export class WineEntryComponent implements OnInit {
  @Input() wineId?: number;
  countries: CountryApi[] = [];
  wineTypes: WineTypeApi[] = [];

  wineName = "";
  countryId?: number;
  wineTypeId?: number;
  systemNumber?: number;
  volume?: number;
  vintage?: number;
  protected isNonVintage = false;

  constructor(
    private readonly countryService: CountryService,
    private readonly wineTypeService: WineTypeService,
    private readonly wineService: WineService,
    ) {
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;

      if (this.wineId) {

        this.wineService
          .getWine(this.wineId)
          .subscribe(wine => {
            this.wineName = wine.name;
            this.countryId = wine.country.id;
            this.wineTypeId = wine.wineType.id;
            this.vintage = wine.vintageYear ?? undefined;
          })

      }
    });

    this.wineTypeService.getWineTypes().subscribe(types => {
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
      volume: this.volume,
      vintageYear: this.vintage,
      isNonVintage: this.isNonVintage,
    };
  }

}
