import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

  @HostBinding('class.fileover')
  fileOver = false;
  @Output() fileDropped = new EventEmitter<any>();

  constructor() {
    // Nothing to do yet
  }


  // Dragover listener
  @HostListener('dragover', ['$event'])
  onDragOver(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
    evt.preventDefault();
    evt.stopPropagation();

    // console.log('Drag over');
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
    const dataTransfer: DataTransfer = evt.dataTransfer;
    const files: FileList = dataTransfer.files;
    console.log('dnd files: ', files);
    console.log('dnd items: ', dataTransfer.items);
    console.log('dnd evt.dataTransfer: ', dataTransfer);

    if (files.length > 0) {

      this.fileDropped.emit(files);
    }
  }
}
