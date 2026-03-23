import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WineService} from '../../../../services/backend/wine.service';
import {WineView} from '../../../../models/wine.model';
import {TastingService} from '../../../../services/backend/tasting.service';
import {WineTastingWineCreate} from '../../../../models/tasting.model';

@Component({
    selector: 'app-add-wine-to-tasting',
    templateUrl: './add-wine-to-tasting.component.html',
    styleUrls: ['./add-wine-to-tasting.component.css'],
    standalone: false
})
export class AddWineToTastingComponent implements OnInit {

  @Input() tastingId!: number;
  @Output() wineAdded = new EventEmitter<void>();

  form!: FormGroup;
  allWines: WineView[] = [];
  filteredWines: WineView[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly wineService: WineService,
    private readonly tastingService: TastingService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      search: [''],
      wineId: [null, Validators.required],
      position: [null, [Validators.required, Validators.min(1)]],
      purchasePrice: [null],
      averageScore: [null],
    });

    this.wineService.getWines().subscribe(wines => {
      this.allWines = wines;
      this.filteredWines = wines;
    });

    this.form.get('search')?.valueChanges.subscribe(term => {
      this.filteredWines = this.allWines.filter(w =>
        w.name.toLowerCase().includes(term.toLowerCase())
      );
    });
  }

  selectWine(wine: WineView): void {
    this.form.patchValue({wineId: wine.id, search: wine.name});
    this.filteredWines = [];
  }

  submit(): void {
    if (this.form.valid) {
      const data: WineTastingWineCreate = {
        wineId: this.form.value.wineId,
        position: this.form.value.position,
        purchasePrice: this.form.value.purchasePrice,
        averageScore: this.form.value.averageScore,
      };
      this.tastingService.addWineToTasting(this.tastingId, data).subscribe(() => {
        this.wineAdded.emit();
        this.form.reset();
      });
    }
  }
}
