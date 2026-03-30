import {Component, OnInit} from '@angular/core';
import {CountryApi} from "../../models/common.model";
import {CountryService} from "../../services/backend/country.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
  imports: [FormsModule],
})
export class CountriesComponent implements OnInit {

  countries: CountryApi[] = [];
  newCountryName = '';

  constructor(private readonly countryService: CountryService) {
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  private loadCountries() {
    this.countryService.getCountries().subscribe(c => {
      this.countries = c;
    });
  }

  protected deleteCountry(id: number) {

    this.countryService.deleteCountry(id).subscribe({
      next: () => {
        this.countries = this.countries.filter(c => c.id !== id);
      },
      error: err => {
        console.error('Failed to delete country', err);
      }
    });
  }

  protected addCountry() {
    if (!this.newCountryName.trim()) return; // ignore empty strings


    this.countryService.addCountry(this.newCountryName.trim())
      .subscribe({
        next: (created) => {
          this.countries.push(created); // lägg till direkt i listan
          this.countries.sort((a, b) => a.name.localeCompare(b.name)); // håll listan alfabetisk
          this.newCountryName = ''; // töm inputfältet
        },
        error: (err) => {
          console.error('Failed to add country', err);
        }
      });
  }
}
