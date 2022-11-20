import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {BackendService, Grape} from "../../backend.service";

@Component({
  selector: 'app-druva',
  templateUrl: './druva.component.html',
  styleUrls: ['./druva.component.css']
})
export class DruvaComponent implements OnInit {

  grapeForm = new FormGroup({
    color: new FormControl<string>(''),
    name: new FormControl<string>('')
  });

  valid = true;
  private service: BackendService;


  constructor(service: BackendService) {
    this.service = service;
  }

  ngOnInit(): void {
    // Nothing to do
  }

  addGrape() {
    console.log("Klickade 'Lägg till'")
    console.log(this.grapeForm);
    const formValue = this.grapeForm.value;
    if (formValue.name && formValue.color) {
      const g:Grape = {
        name: formValue.name,
        color: formValue.color
      };
      console.log("Calling this.service.addGrape(g);");
      const observable = this.service.addGrape2(g);
      observable.subscribe(() => {
        console.log("Grape added?");
        //console.log( x.color, x.name);
      });
    }

  }
}


