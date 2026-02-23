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

  protected deleteCountry(id: number) {

    this.backendService.deleteCountry(id).subscribe({
      next: () => {
        this.countries = this.countries.filter(c => c.id !== id);
      },
      error: err => {
        console.error('Failed to delete country', err);
      }
    });
  }
}
