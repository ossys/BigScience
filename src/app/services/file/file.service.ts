import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { EndpointService } from '../../services/endpoint/endpoint.service';
import { StorageService } from '../../services/storage/storage.service';

import { Constants } from '../../constants';
import { AppFile } from '../../models/app-file';
import { AppFileChunk } from '../../models/app-file-chunk';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private endpointService: EndpointService,
        private storageService: StorageService) { }

    startUpload(file: AppFile) {
        let uploads: any = this.storageService.get(Constants.LOCAL_STORAGE.UPLOADS);
        if (uploads == null || uploads.length == 0) {
            uploads = {};
        } else {
            uploads = JSON.parse(uploads);
        }
        file.uuid = uuid();
        uploads[file.uuid] = {
            created: new Date(),
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            chunks_in_process: Array.apply(null, { length: 10 }).map(Function.call, Number),
            total_chunks: Math.floor(file.size / Constants.FILE.CHUNK_SIZE_BYTES) + ((file.size / Constants.FILE.CHUNK_SIZE_BYTES) > 0 ? 1 : 0)
        };
        this.storageService.set(Constants.LOCAL_STORAGE.UPLOADS, JSON.stringify(uploads));
        console.log(uploads[file.uuid]);
        for (let chunk_id = 0; chunk_id < 1/*uploads[file.uuid].chunks_in_process.length*/; chunk_id++) {
            file.getChunk(chunk_id).subscribe({
                next: (chunk: AppFileChunk) => {
//                    console.log(chunk);
                    if (chunk.event.type == "progress") {
                        console.log('PROGRESS');
                    } else if(chunk.event.type == "loadend" && chunk.event.target.readyState == FileReader.DONE) {
                        console.log('LOADEND');
                    }
                },
                error: (event: ProgressEvent) => { console.log('ERROR'); console.log(event); },
                complete: () => { console.log('COMPLETE FILE READ'); }
            });
        }
    }

    pauseUpload() {
    }

    resumeUpload() {
    }

    cancelUpload() {
    }

}
