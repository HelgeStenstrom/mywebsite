import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

  @HostBinding('class.fileover')
  fileOver = false;

  constructor() { }
  // Dragover listener
  @HostListener('dragover', ['$event'])
  onDragOver(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log('Drag over');
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log('Drag leave');
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files: FileList = evt.dataTransfer.files;
    if (files.length > 0) {
      // Do some stuff here
      console.log(`You dropped ${files.length} file(s).`);
      console.log(files);
      for (let i = 0; i < files.length; i++) { // NOSONAR
        const file = files[i];
        console.log(file.name);
        console.log(file.webkitRelativePath);
        console.log(file.type);
        console.log(file.size);
        // It's unclear to me how we can find the actual file, since we only have the name, not the full path.
        // And it's in the client machine, not in the browser.
      }
    }
  }
}
