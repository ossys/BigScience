import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { EndpointService } from '../../services/endpoint/endpoint.service';
import { StorageService } from '../../services/storage/storage.service';

import { Constants } from '../../constants';
import { AppFile } from '../../models/app-file';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    uuid: string;

    constructor(private endpointService: EndpointService,
                private storageService: StorageService) { }

    startUpload() {
        this.uuid = uuid();
    }

    pauseUpload() {
    }

    resumeUpload() {
    }

    cancelUpload() {
    }

}
