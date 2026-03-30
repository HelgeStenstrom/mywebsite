import {Component, OnInit} from '@angular/core';
import {WineTypeService} from "../../services/backend/wine-type.service";
import {WineTypeApi} from "../../models/common.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-wine-types',
  templateUrl: './wine-types.component.html',
  styleUrls: ['./wine-types.component.css'],
  imports: [FormsModule],
})
export class WineTypesComponent implements OnInit {

  wineTypes: WineTypeApi[] = [];
  newWineType = '';

  constructor(private readonly wineTypeService: WineTypeService,) {
  }

  ngOnInit(): void {
    this.loadWineTypes();
  }

  private loadWineTypes(): void {
    this.wineTypeService.getWineTypes().subscribe(c => {
      this.wineTypes = c;
    });
  }

  protected deleteWineType(id: number) {

    this.wineTypeService.deleteWineType(id).subscribe({
      next: () => {
        this.wineTypes = this.wineTypes.filter(c => c.id !== id);
      },
      error: err => {
        console.error('Failed to delete wine type', err);
      }
    })
  }

  protected addWineType() {
    if (!this.newWineType.trim()) return; // ignore empty strings


    this.wineTypeService.addWineType(this.newWineType.trim())
      .subscribe({
        next: (created) => {
          this.wineTypes.push(created);
          this.wineTypes.sort((a, b) => a.name.localeCompare(b.name));
          this.newWineType = '';
        },
        error: (err) => {
          console.error('Failed to add wine type', err);
        }
      });
  }
}
