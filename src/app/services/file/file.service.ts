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
        processModel.endChunk = (processModel.totalChunks < Constants.FILE.ROUND_SIZE) ?
                                processModel.totalChunks : (processModel.round < processModel.totalChunks - 1) ?
                                ((processModel.round + 1) * Constants.FILE.ROUND_SIZE) : processModel.totalChunks;

        processModel.file.totalChunks = processModel.totalChunks;

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
                    processModel.endChunk = (processModel.totalChunks < Constants.FILE.ROUND_SIZE) ?
                    processModel.totalChunks : (processModel.round < processModel.totalChunks - 1) ?
                    ((processModel.round + 1) * Constants.FILE.ROUND_SIZE) : processModel.totalChunks;
                    processModel.status = AppFileProcessModel.Status.PROCESSING;
                    this.callRound(processModel);
                } else {
                    //                    console.log(processModel.percentage);
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
                        total_chunks: Math.floor(processModel.file.size / Constants.FILE.CHUNK_SIZE_BYTES) +
                        ((processModel.file.size / Constants.FILE.CHUNK_SIZE_BYTES) > 0 ? 1 : 0)
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
                    } else if (chunk.event.type == "progress") {
                    } else if (chunk.event.type == "loadend" && chunk.event.target.readyState == FileReader.DONE) {
                        processModel.sha256.update(new Uint8Array(chunk.event.target.result));
                        this.timerService.stop();

                        // Percentage
                        processModel.totalBytes += chunk.event.total;
                        processModel.percentage = (processModel.totalBytes / processModel.file.size) * 100;

                        // Est Time Remaining
                        processModel.avgBytesPerSec = ((Constants.FILE.CHUNK_SIZE_BYTES / this.timerService.getTime()) +
                                                        processModel.avgBytesPerSec) / 2;
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

    uploadFile(file: AppFileModel) {
        this.endpointService.filePrepare(file).subscribe(result => {
            if (result.success) {
                for (let chunk_id = 0; chunk_id < 10; chunk_id++) {
                    this.uploadChunk(chunk_id, file);
                }
            }
        });
    }

    uploadChunk(chunk_id: number, file: AppFileModel) {
        file.getChunk(chunk_id).subscribe({
            next: (chunk: AppFileChunkModel) => {
                if (chunk.event.type == "progress") {
                } else if (chunk.event.type == "loadend" && chunk.event.target.readyState == FileReader.DONE) {
                    let sha256 = new fastsha256.Hash();
                    sha256.update(new Uint8Array(chunk.event.target.result));
                    chunk.sha256 = new Buffer(sha256.digest()).toString('hex');
                    console.log('UPLOAD CHUNK (' + chunk.id + '): ' + chunk.sha256);
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

    pauseUpload(file: AppFileModel) {
    }

    resumeUpload(file: AppFileModel) {
    }

    cancelUpload(file: AppFileModel) {
    }

}
