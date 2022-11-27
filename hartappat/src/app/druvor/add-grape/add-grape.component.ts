import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {BackendService, Grape} from "../../backend.service";
import {Observable} from "rxjs";

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

  private service: BackendService;


  constructor(service: BackendService) {
    this.service = service;
  }

  ngOnInit(): void {
    // Nothing to do
  }

  addGrape() {
    // console.log("Klickade 'Lägg till'")
    // console.log(this.grapeForm);
    const formValue = this.grapeForm.value;
    if (formValue.name && formValue.color) {
      const g:Grape = {
        name: formValue.name,
        color: formValue.color
      };
      //console.log("Calling this.service.addGrape(g);");
      this.service.addGrape(g).subscribe(() => {
        this.service.newEvent(g);
      });
    }

  }
}


