import {Component, OnInit} from '@angular/core';
import {BackendService, WineTypeApi} from "../../services/backend.service";

@Component({
  selector: 'app-wine-types',
  templateUrl: './wine-types.component.html',
  styleUrls: ['./wine-types.component.css']
})
export class WineTypesComponent implements OnInit {

  wineTypes: WineTypeApi[] = [];
  newWineType = '';

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.loadWineTypes();
  }

  private loadWineTypes(): void {
    this.backendService.getWineTypes().subscribe(c => {
      this.wineTypes = c;
    });
  }

  protected deleteWineType(id: number) {

    this.backendService.deleteWineType(id).subscribe({
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


    this.backendService.addWineType(this.newWineType.trim())
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
