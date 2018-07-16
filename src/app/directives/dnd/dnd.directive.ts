import { Directive, HostListener, HostBinding, EventEmitter, Input, Output } from '@angular/core';

import { FileModel } from '../../models/file.model';

@Directive({
    selector: '[appDnd]'
})
export class DndDirective {

    @HostBinding('style.background')
    private background: string = '#eee';

    @Input() private allowed_extensions: Array<string> = [];
    @Output() private filesEmitter: EventEmitter<FileModel[]> = new EventEmitter();

    constructor() { }

    @HostListener('dragover', ['$event'])
    public onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.background = '#999';
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.background = '#eee';
    }

    @HostListener('drop', ['$event']) public onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.background = '#eee';
        const files = event.dataTransfer.files;
        const emitFiles: Array<FileModel> = [];

        if (files.length > 0) {
            for (let i = 0, len = files.length; i < len; i++) {
                const file = new FileModel().deserialize(files[i]);
                const ext = files[i].name.split('.')[files[i].name.split('.').length - 1];
                if (this.allowed_extensions.lastIndexOf(ext) !== -1) {
                    file.status = FileModel.Status.VALID;
                } else {
                    file.status = FileModel.Status.INVALID;
                }
                emitFiles.push(file);
            }
            this.filesEmitter.emit(emitFiles);
        }
    }
}
