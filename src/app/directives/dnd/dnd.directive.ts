import { Directive, HostListener, HostBinding, EventEmitter, Input, Output } from '@angular/core';

import { AppFile } from '../../models/app-file';

@Directive({
    selector: '[appDnd]'
})
export class DndDirective {

    @HostBinding('style.background')
    private background = '#eee';

    @Input() private allowed_extensions: Array<string> = [];
    @Output() private filesChangeEmiter: EventEmitter<AppFile[]> = new EventEmitter();
    @Output() private filesInvalidEmiter: EventEmitter<AppFile[]> = new EventEmitter();

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
        let files = event.dataTransfer.files;
        let valid_files: Array<AppFile> = [];
        let invalid_files: Array<AppFile> = [];
        if (files.length > 0) {
            for(var i = 0, len = files.length; i < len; i++) {
                let ext = files[i].name.split('.')[files[i].name.split('.').length - 1];
                if (this.allowed_extensions.lastIndexOf(ext) != -1) {
                    valid_files.push(new AppFile().deserialize(files[i]));
                } else {
                    invalid_files.push(new AppFile().deserialize(files[i]));
                }
            }
            this.filesChangeEmiter.emit(valid_files);
            this.filesInvalidEmiter.emit(invalid_files);
        }
    }
}
