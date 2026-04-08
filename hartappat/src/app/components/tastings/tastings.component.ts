import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {TastingService} from "../../services/backend/tasting.service";
import {WineTastingSummary} from "../../models/tasting.model";
import {Router, RouterLink} from "@angular/router";
import {CreateTastingComponent} from "./create-tasting/create-tasting.component";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-tastings',
  templateUrl: './tastings.component.html',
  styleUrls: ['./tastings.component.css'],
  imports: [
    CreateTastingComponent,
    AsyncPipe,
    DatePipe,
    FormsModule,
    MatSlideToggleModule,
    RouterLink,
  ],
})
export class TastingsComponent implements OnInit {

  tastings$: Observable<WineTastingSummary[]> = of([]);
  advanced = false;
  selectedIds = new Set<number>();

  constructor(private readonly service: TastingService,
              private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    this.tastings$ = this.service.getTastings();
  }

  openTasting(id: number): void {
    void this.router.navigate(['/tastings', id]);
  }

  onDeleteCheckboxChange(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  confirmDelete(id: number): void {
    this.service.deleteTasting(id).subscribe(() => {
      this.tastings$ = this.tastings$.pipe(
        map(tastings => tastings.filter(t => t.id !== id))
      );
      this.selectedIds.delete(id);
    });
  }
}
