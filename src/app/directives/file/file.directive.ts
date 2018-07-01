import { Directive, Input, HostBinding } from '@angular/core';

import { AppFile } from '../../models/app-file';

@Directive({
    selector: 'appFile'
})
export class FileDirective {

    @HostBinding('style.background')
    private background = '#eee';

    @Input() private file: AppFile;

    constructor() { }

}
