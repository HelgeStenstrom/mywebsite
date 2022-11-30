import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {BackendService, Grape} from "../../backend.service";

@Component({
  selector: 'app-add-grape',
  templateUrl: './add-grape.component.html',
  styleUrls: ['./add-grape.component.css']
})
export class AddGrapeComponent implements OnInit {

  grapeForm = new FormGroup({
    color: new FormControl<string>(''),
    name: new FormControl<string>('')
  });

  constructor(private service: BackendService) {
    this.service = service;
  }

  ngOnInit(): void {
    // Nothing to do
  }

  addGrape(): void {

    const formValue = this.grapeForm.value;
    if (formValue.name && formValue.color) {
      const g:Grape = {
        name: formValue.name,
        color: formValue.color
      };

      this.service.addGrape(g).subscribe(() => {
        this.service.newEvent(g);
      });
    }

  }
}


