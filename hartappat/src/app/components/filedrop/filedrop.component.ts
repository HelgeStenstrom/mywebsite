import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {Observer} from "rxjs";
import {ValidationReply, ValidatorService} from "../../services/validator.service";

/**
 Most parts are from <a href="https://medium.com/@tarekabdelkhalek/how-to-create-a-drag-and-drop-file-uploading-in-angular-78d9eba0b854">
 How to create a Drag and Drop file uploading in Angular</a>
 <p>
 <a href="https://github.com/progtarek/angular-drag-n-drop-directive">Git</a>
 </p>

 <p> Live version on
 <a href="https://stackblitz.com/edit/angular-drag-n-drop-directive">StackBlitz</a>
 </p>

 <p> Test at
 <a href="http://helges-mbp-2:8080/tests">Test page</a>
 </p>
 */


@Component({
  selector: 'app-filedrop',
  templateUrl: './filedrop.component.html',
  styleUrls: ['./filedrop.component.css']
})
export class FiledropComponent implements OnInit {
  private preview: HTMLElement | null = null;

  text = {verdict: "pof", exceptionName: "en", message: 'm'}

  constructor(private backendService: BackendService, private validatorService: ValidatorService) {
    // Nothing to do yet
  }

  ngOnInit(): void {
    // Nothing to do yet
    this.preview = document.getElementById('preview');
  }

  onFileDropped($event: FileList) {

    const files = $event;
    // Do some stuff here
    for (let i = 0; i < files.length; i++) { // NOSONAR
      const file: File = files[i];
      // It's unclear to me how we can find the actual file, since we only have the name, not the full path.
      // And it's in the client machine, not in the browser.
    }

    this.handleFiles(files);
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
   */
   handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      this.addImageToPage(file);
    }
    const observable = this.validatorService.uploadMultipart(file);
    observable.subscribe(new ValidatingObserver(this.text));
    console.log('handleFile(): added subscription on returned result');

  }

  private addImageToPage(file: File) {
    const htmlImageElement: HTMLImageElement = document.createElement("img");
    htmlImageElement.width = 100;
    const img: any = htmlImageElement;
    img.classList.add("obj");
    img.file = file;
    this.preview?.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result;
    };
    reader.readAsDataURL(file);
  }

  onValidateFake() {
    const file = new File(["first line", "second line"], "filename.txt");
    this.validatorService
      .validateFile(file)
      .subscribe(new ValidatingObserver({verdict:"", message:"", exceptionName: ""}));
  }

  onUploadMultipart() {
    const file = new File(["first line", "second line"], "filename.txt");
    this.validatorService
      .uploadMultipart(file)
      .subscribe(new ValidatingObserver({verdict:"", message:"", exceptionName: ""}));
  }


}


class ValidatingObserver implements Observer<ValidationReply> {
  private text: { verdict: string; message: string; exceptionName: string };
  constructor(text: { verdict: string; message: string; exceptionName: string }) {
    this.text = text;
  }

  complete(): void {
    // Nothing to do?
  }

  error(err: any): void {
    console.error('ValidatingObserver: There was an error in the validation backend: ', err);
  }

  next(value: ValidationReply): void {
    const verdict: string = value.verdict;

    if (verdict === 'FAIL') {
      console.log(`Verdict: ${verdict}`);
    } else {
      console.log(`Not fail, but: ${verdict}`);
    }

    switch (verdict) {
      case 'PASS':
        console.log("IT's pass!", value.filename);
        this.text.message = "No problems!";
        this.text.exceptionName = "";
        break;
      case 'FAIL':
        console.log("IT's fail!");
        console.log(value.failureReason)
        console.log(value.stackTrace);
        this.text.message = value.stackTrace;
        this.text.exceptionName = value.failureReason;
        break;
      default:
        console.log("It's", verdict.valueOf(), value.filename);
        console.log(value.failureReason);
        break;
    }
    this.text.verdict = verdict;

  }
}
