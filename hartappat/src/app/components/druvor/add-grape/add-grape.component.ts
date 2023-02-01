import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {BackendService, Grape} from "../../../services/backend.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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

  constructor(
    private service: BackendService,
    public dialogRef: MatDialogRef<AddGrapeComponent>,
    @Inject(MAT_DIALOG_DATA) public grapeToEdit: Grape
  ) {
  }

  ngOnInit(): void {
    if (this.isEditCall()) {
      // console.log("AddGrapeComponent called for edit.");
      // console.log(this.grapeToEdit.name, this.grapeToEdit.color);
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
        name: formValue.name,
        color: formValue.color
      };

      if (this.isEditCall()) {
        this.service.patchGrape(this.grapeToEdit, g).subscribe(() => {
          this.service.newEvent(g);
        });
        this.closeDialog();
      } else {
        this.service.addGrape(g).subscribe(() => {
          this.service.newEvent(g);
        });

      }
    }
  }

  closeDialog() {
    this.dialogRef.close("dialog closed"); // https://material.angular.io/components/dialog/overview
  }
}


