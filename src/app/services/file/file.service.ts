import { Injectable } from '@angular/core';
import { concat } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Buffer } from 'buffer';

import * as fastsha256 from 'fast-sha256';

import { EndpointService } from '../../services/endpoint/endpoint.service';
import { StorageService } from '../../services/storage/storage.service';
import { TimerService } from '../../services/timer/timer.service';

import { Constants } from '../../constants';
import { AppFileModel } from '../../models/app-file.model';
import { AppFileProcessModel } from '../../models/app-file-process.model';
import { AppFileChunkModel } from '../../models/app-file-chunk.model';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private endpointService: EndpointService,
        private storageService: StorageService,
        private timerService: TimerService) { }

    processFile(file: AppFileModel) {
        let processModel: AppFileProcessModel = new AppFileProcessModel();
        processModel.file = file;
        processModel.sha256 = new fastsha256.Hash();
        processModel.totalChunks = Math.ceil(file.size / Constants.FILE.CHUNK_SIZE_BYTES);
        processModel.totalRounds = Math.ceil(processModel.totalChunks / Constants.FILE.ROUND_SIZE);
        processModel.startChunk = processModel.round * Constants.FILE.ROUND_SIZE;
        processModel.endChunk = (processModel.totalChunks < Constants.FILE.ROUND_SIZE) ? processModel.totalChunks : (processModel.round < processModel.totalChunks - 1) ? ((processModel.round + 1) * Constants.FILE.ROUND_SIZE) : processModel.totalChunks;

        console.log('PROCESSING FILE: ' + file.name + '(' + file.size + ' / ' + Constants.FILE.CHUNK_SIZE_BYTES + ')');
        console.log('NUM CHUNKS: ' + processModel.totalChunks);
        console.log('NUM ROUNDS: ' + processModel.totalRounds);

        this.callRound(processModel);
    }

    callRound(processModel: AppFileProcessModel) {
        this.processChunks(processModel).subscribe({
            error: (processModel) => { },
            next: (processModel) => {
                if (processModel.status == AppFileProcessModel.Status.COMPLETE) {
                    processModel.round++;
                    processModel.startChunk = processModel.round * Constants.FILE.ROUND_SIZE;
                    processModel.endChunk = (processModel.totalChunks < Constants.FILE.ROUND_SIZE) ? processModel.totalChunks : (processModel.round < processModel.totalChunks - 1) ? ((processModel.round + 1) * Constants.FILE.ROUND_SIZE) : processModel.totalChunks;
                    processModel.status = AppFileProcessModel.Status.PROCESSING;
                    this.callRound(processModel);
                } else {
                    console.log(processModel.percentage);
                    //                    console.log(processModel.estTime);
                }
            },
            complete: () => {
                processModel.file.sha256 = new Buffer(processModel.sha256.digest()).toString('hex');
                console.log('FILE COMPLETE: ' + processModel.file.sha256);

                let uploads: any = this.storageService.get(Constants.LOCAL_STORAGE.UPLOADS);

                if (uploads == null || uploads.length == 0) {
                    uploads = {};
                } else {
                    uploads = JSON.parse(uploads);
                }

                let file_upload = uploads[processModel.file.sha256];
                if (file_upload == null) {
                    uploads[processModel.file.sha256] = {
                        created: new Date(),
                        name: processModel.file.name,
                        size: processModel.file.size,
                        lastModified: processModel.file.lastModified,
                        lastModifiedDate: processModel.file.lastModifiedDate,
                        chunks_uploading: Array.apply(null, { length: Constants.FILE.NUM_CHUNK_UPLOADS }).map(Function.call, Number),
                        total_chunks: Math.floor(processModel.file.size / Constants.FILE.CHUNK_SIZE_BYTES) + ((processModel.file.size / Constants.FILE.CHUNK_SIZE_BYTES) > 0 ? 1 : 0)
                    };
                    this.storageService.set(Constants.LOCAL_STORAGE.UPLOADS, JSON.stringify(uploads));
                }
            }
        });
    }

    processChunks(processModel: AppFileProcessModel): Observable<AppFileProcessModel> {
        return new Observable<AppFileProcessModel>((observer: Observer<AppFileProcessModel>) => {
            let chain: Observable<AppFileChunkModel>;

            for (let i = processModel.startChunk; i < processModel.endChunk; i++) {
                if (chain) {
                    chain = chain.pipe(concat(processModel.file.getChunk(i)));
                } else {
                    chain = processModel.file.getChunk(i);
                }
            }

            chain.subscribe({
                error: (chunk: AppFileChunkModel) => { console.log('ERROR'); },
                next: (chunk: AppFileChunkModel) => {
                    if (chunk.event.type == "loadstart") {
                        this.timerService.start();
                        //console.log(chunk);
                    } else if (chunk.event.type == "progress") {
                        //console.dir(chunk);
                    } else if (chunk.event.type == "loadend" && chunk.event.target.readyState == FileReader.DONE) {
                        //console.log(chunk.id);
                        processModel.sha256.update(new Uint8Array(chunk.event.target.result));
                        this.timerService.stop();

                        // Percentage
                        processModel.totalBytes += chunk.event.total;
                        processModel.percentage = (processModel.totalBytes / processModel.file.size) * 100;

                        // Est Time Remaining
                        processModel.avgBytesPerSec = ((Constants.FILE.CHUNK_SIZE_BYTES / this.timerService.getTime()) + processModel.avgBytesPerSec) / 2;
                        processModel.estTime = ((processModel.file.size - processModel.totalBytes) / processModel.avgBytesPerSec) / 1000;
                        this.timerService.clear();

                        observer.next(processModel);
                    }
                },
                complete: () => {
                    // ROUND COMPLETE
                    if (processModel.round < processModel.totalRounds - 1) {
                        processModel.status = AppFileProcessModel.Status.COMPLETE;
                        observer.next(processModel);
                    } else {
                        observer.complete();
                    }
                }
            });
            return { unsubscribe() { } };
        });
    }

    startUpload(file: AppFileModel) {
        let uploads: any = JSON.parse(this.storageService.get(Constants.LOCAL_STORAGE.UPLOADS));
        console.log('GETTING FILE HASH: ' + file.sha256);
        for (let chunk_id = 0; chunk_id < uploads[file.sha256].chunks_uploading.length; chunk_id++) {
            let sha256 = new fastsha256.Hash();
            file.getChunk(uploads[file.sha256].chunks_uploading[chunk_id]).subscribe({
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
                complete: () => { console.log('COMPLETE CHUNK READ'); }
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
