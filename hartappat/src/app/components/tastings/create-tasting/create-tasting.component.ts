import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TastingService} from "../../../services/backend/tasting.service";

@Component({
  selector: 'app-create-tasting',
  templateUrl: './create-tasting.component.html',
  styleUrls: ['./create-tasting.component.css']
})
export class CreateTastingComponent implements OnInit {

  tastingForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: TastingService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.tastingForm = this.fb.group({
      title: ['', Validators.required],
      notes: ['', Validators.required],
      tastingDate: ['', Validators.required],
    });
  }

  createTasting(): void {
    if (this.tastingForm.valid) {
      this.service.createTasting(this.tastingForm.value).subscribe(tasting => {
        this.router.navigate(['/tastings', tasting.id]);
      });
    }
  }
}
