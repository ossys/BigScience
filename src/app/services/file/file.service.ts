import { Injectable } from '@angular/core';
import { concat } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Buffer } from 'buffer';

import * as fastsha256 from 'fast-sha256';

import { EndpointService } from '../../services/endpoint/endpoint.service';
import { StorageService } from '../../services/storage/storage.service';
import { TimerService } from '../../services/timer/timer.service';

import { Constants } from '../../constants';
import { AppFileModel } from '../../models/app-file.model';
import { AppFileChunkModel } from '../../models/app-file-chunk.model';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private endpointService: EndpointService,
        private storageService: StorageService,
        private timerService: TimerService) { }

    processFile(file: AppFileModel) {
        let num_chunks = Math.ceil(file.size / Constants.FILE.CHUNK_SIZE_BYTES);
        let sha256 = new fastsha256.Hash();
        let chain: Observable<AppFileChunkModel>;
        
        // Percentage
        let totalBytes = 0;
        let percentage = 0;
        
        // Est Time Left
        let estTime = 0;
        
        for (let i = 0; i < num_chunks; i++) {
            if (chain) {
                chain = chain.pipe(concat(file.getChunk(i)));
            } else {
                chain = file.getChunk(i);
            }
        }
        chain.subscribe({
            error: (chunk: AppFileChunkModel) => { console.log('ERROR'); },
            next: (chunk: AppFileChunkModel) => {
                if (chunk.event.type == "loadstart") {
                    this.timerService.start();
//                    console.log(chunk);
                } else if (chunk.event.type == "progress") {
//                    console.dir(chunk);
                } else if (chunk.event.type == "loadend" && chunk.event.target.readyState == FileReader.DONE) {
                    sha256.update(new Uint8Array(chunk.event.target.result));
                    this.timerService.stop();
//                    console.log('BLOCK B/s: ' + );
                    
                    // Percentage
                    totalBytes += chunk.event.total;
                    percentage = (totalBytes / file.size)*100;
                    console.log(percentage);
                    
                    // Est Time Remaining
                    estTime = ((file.size - totalBytes) / (Constants.FILE.CHUNK_SIZE_BYTES / this.timerService.getTime()))/1000;
                    console.log('Est Time (s): ' + estTime + 's');
                    this.timerService.clear();
                }
            },
            complete: () => { file.sha256 = new Buffer(sha256.digest()).toString('hex'); console.log('HASH: ' + file.sha256); }
        });
    }

    startUpload(file: AppFileModel) {
        let uploads: any = this.storageService.get(Constants.LOCAL_STORAGE.UPLOADS);

        if (uploads == null || uploads.length == 0) {
            uploads = {};
        } else {
            uploads = JSON.parse(uploads);
        }

        let file_upload = uploads[file.sha256];
        if (file_upload == null) {
            uploads[file.sha256] = {
                created: new Date(),
                name: file.name,
                size: file.size,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                chunks_uploading: Array.apply(null, { length: 10 }).map(Function.call, Number),
                total_chunks: Math.floor(file.size / Constants.FILE.CHUNK_SIZE_BYTES) + ((file.size / Constants.FILE.CHUNK_SIZE_BYTES) > 0 ? 1 : 0)
            };
            this.storageService.set(Constants.LOCAL_STORAGE.UPLOADS, JSON.stringify(uploads));
        }

        let sha256 = new fastsha256.Hash();
        for (let chunk_id = 0; chunk_id < uploads[file.sha256].chunks_in_process.length; chunk_id++) {
            file.getChunk(chunk_id).subscribe({
                next: (chunk: AppFileChunkModel) => {
                    if (chunk.event.type == "progress") {
                    } else if (chunk.event.type == "loadend" && chunk.event.target.readyState == FileReader.DONE) {
                        sha256.update(new Uint8Array(chunk.event.target.result));
                        chunk.sha256 = new Buffer(sha256.digest()).toString('hex');
                        console.log('CHUNK HASH: ' + chunk.sha256);
                        this.endpointService.dataUpload(chunk).subscribe(result => {
                            if (result.success) {
                            }
                        });
                    }
                },
                error: (chunk: AppFileChunkModel) => { console.log('ERROR'); console.log(event); },
                complete: () => { console.log('COMPLETE FILE READ'); }
            });
        }
    }

    pauseUpload(file: AppFileModel) {
    }

    resumeUpload(file: AppFileModel) {
    }

    cancelUpload(file: AppFileModel) {
    }

}
