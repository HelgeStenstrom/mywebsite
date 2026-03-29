import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TastingService} from "../../../services/backend/tasting.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-edit-tasting',
  imports: [FormsModule],
  templateUrl: './edit-tasting.component.html',
  styleUrl: './edit-tasting.component.css',
})
export class EditTastingComponent implements OnInit {
  title = '';
  notes = '';
  tastingDate = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tastingService: TastingService,
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tastingService.getTasting(id).subscribe(tasting => {
      this.title = tasting.title;
      this.notes = tasting.notes ?? '';
      this.tastingDate = tasting.tastingDate;
    });
  }

  save(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tastingService.patchTasting(id, {
      title: this.title,
      notes: this.notes,
      tastingDate: this.tastingDate,
    }).subscribe();
  }

}
