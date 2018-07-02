import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AppFile } from '../../models/app-file';

@Directive({
    selector: '[appFile]'
})
export class FileDirective {

    @Input() set appFile(file: AppFile) {
        console.log('SET FILE');
        console.dir(file);
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef) {

    }

}
