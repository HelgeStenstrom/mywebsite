import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

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


  constructor() {}

  ngOnInit(): void {
  }

  addGrape() {
    console.log("Klickade 'Lägg till'")
    console.log(this.grapeForm);
  }
}

type Grape = {
  name: string;
  color: string;
}


