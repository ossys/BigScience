import { Component, OnInit } from '@angular/core';

import { BytesPipe, TruncatePipe } from 'angular-pipes';

import { AppFile } from '../../../models/app-file';

@Component({
    selector: 'app-data-upload',
    templateUrl: './data-upload.component.html',
    styleUrls: ['./data-upload.component.css']
})
export class DataUploadComponent implements OnInit {

    private files: AppFile[] = [];

    constructor() { }

    ngOnInit() {
    }
    
    onFileSelectFormChange(event) {
        console.log(event.target.files);
    }

    onFilesAdded(fileList: AppFile[]) {
        this.files = this.files.concat(fileList);
    }

}
