import { Component, OnInit } from '@angular/core';

import { BytesPipe, TruncatePipe } from 'angular-pipes';

import { FileService } from '../../../services/file/file.service';
import { AppFileModel } from '../../../models/app-file.model';

@Component({
    selector: 'app-data-upload',
    templateUrl: './data-upload.component.html',
    styleUrls: ['./data-upload.component.css']
})
export class DataUploadComponent implements OnInit {

    private files: AppFileModel[] = [];

    constructor(private fileService: FileService) { }

    ngOnInit() {
    }

    onFileSelectFormChange(event) {
        console.log(event.target.files);
    }

    onFilesAdded(fileList: AppFileModel[]) {
        this.files = this.files.concat(fileList);
        for (let i = 0; i < fileList.length; i++) {
            this.fileService.processFile(fileList[i]);
        }
    }

    upload(file) {
        this.fileService.uploadFile(file);
    }

}
