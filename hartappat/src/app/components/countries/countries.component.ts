import {Component, OnInit} from '@angular/core';
import {BackendService, CountryApi} from "../../services/backend.service";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  countries: CountryApi[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getCountries().subscribe(countries => {
      this.countries = countries;
      console.log(this.countries);
      console.log("ngOnInit for CountriesComponent called.");
    });
  }

}
