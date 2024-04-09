import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { BackendService, Grape } from "../../../services/backend.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";

@Component({
  selector: 'app-add-grape',
  templateUrl: './add-grape.component.html',
  styleUrls: ['./add-grape.component.css']
})
export class AddGrapeComponent implements OnInit {

  @Output()
  grapeAdded: EventEmitter<Grape> = new EventEmitter<Grape>();

  grapeForm = new FormGroup({
    color: new FormControl<string>(''),
    name: new FormControl<string>('')
  });

  constructor(
    private service: BackendService,
    public dialogRef: MatDialogRef<AddGrapeComponent>,
    @Inject(MAT_DIALOG_DATA) public grapeToEdit: Grape
  ) {
  }

  ngOnInit(): void {
    if (this.isEditCall()) {
      this.grapeForm.controls.name.setValue(this.grapeToEdit.name);
      this.grapeForm.controls.color.setValue(this.grapeToEdit.color);
    }
  }

  private isEditCall() {
    return Object.keys(this.dialogRef).length !== 0;
  }

  addGrape(): void {

    const formValue = this.grapeForm.value;
    if (formValue.name && formValue.color) {
      const g:Grape = {
        id: -1,
        name: formValue.name,
        color: formValue.color
      };

      let patchGrape$: Observable<void>;
      if (this.isEditCall()) {
        patchGrape$ = this.service.patchGrape(this.grapeToEdit, g);
        this.closeDialog();
      } else {
        patchGrape$ = this.service.addGrape(g);
      }
      patchGrape$.subscribe(() => {
        this.service.newEvent(g);
        this.grapeAdded.emit(g);
      });

      // TODO: Jag vill att detta formulär ska uppdatera grape$ i DruvorComponent.

    }
  }

  closeDialog() {
    this.dialogRef.close("dialog closed"); // https://material.angular.io/components/dialog/overview
  }
}


