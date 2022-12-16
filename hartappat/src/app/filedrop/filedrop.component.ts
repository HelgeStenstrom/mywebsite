import {Component, HostListener, OnInit} from '@angular/core';

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

  constructor() {
    // Nothing to do yet
  }

  ngOnInit(): void {
    // Nothing to do yet
    this.preview = document.getElementById('preview');
  }

  onFileDropped($event: any) {
    console.log('FiledropComponent got onFileDropped event: ', $event);

    const files: any = $event
    // Do some stuff here
    console.log(`You dropped ${files.length} file(s).`);
    console.log(files);
    for (let i = 0; i < files.length; i++) { // NOSONAR
      const file = files[i];
      console.log('Name: ', file.name);
      console.log('webkitRelativePath: ', file.webkitRelativePath);
      console.log('type: ', file.type);
      console.log('size: ', file.size);
      // It's unclear to me how we can find the actual file, since we only have the name, not the full path.
      // And it's in the client machine, not in the browser.
    }

    this.handleFiles(files);
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
   */
   handleFiles(files: any[]) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith('image/')) {
        const img: any = document.createElement("img");
        img.classList.add("obj");
        img.file = file;
        this.preview?.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result;
        };
        reader.readAsDataURL(file);
      } else {
        // Nothing to do
      }
    }
  }
}
