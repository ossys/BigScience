import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Buffer } from 'buffer';
import { concat } from 'rxjs/operators';

import * as fastsha256 from 'fast-sha256/sha256';

import { EndpointService } from '../../../services/endpoint/endpoint.service';
import { TimerService } from '../../../services/timer/timer.service';

import { Constants } from '../../../constants';
import { AppFileModel } from '../../../models/app-file.model';
import { AppFileProcessModel } from '../../../models/app-file-process.model';
import { AppFileChunkModel } from '../../../models/app-file-chunk.model';

@Component({
    selector: 'app-data-upload',
    templateUrl: './data-upload.component.html',
    styleUrls: ['./data-upload.component.css']
})
export class DataUploadComponent implements OnInit {

    processingFiles: AppFileModel[] = [];
    uploadingFiles: AppFileModel[] = [];

    constructor(private endpointService: EndpointService,
                private timerService: TimerService) { }

    ngOnInit() {
    }

    onFileSelectFormChange(event) {
        console.log(event.target.files);
    }

    onFilesAdded(fileList: AppFileModel[]) {
        this.processingFiles = this.processingFiles.concat(fileList);
        for (let i = 0; i < fileList.length; i++) {
            this.processFile(fileList[i]);
        }
    }

    upload(file) {
        this.uploadFile(file);
    }

    processFile(file: AppFileModel) {
        const processModel: AppFileProcessModel = new AppFileProcessModel();
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
            error: () => { },
            next: (pModel) => {
                if (pModel.status === AppFileProcessModel.Status.COMPLETE) {
                    pModel.round++;
                    pModel.startChunk = pModel.round * Constants.FILE.ROUND_SIZE;
                    pModel.endChunk = (pModel.totalChunks < Constants.FILE.ROUND_SIZE) ?
                    pModel.totalChunks : (pModel.round < pModel.totalChunks - 1) ?
                    ((pModel.round + 1) * Constants.FILE.ROUND_SIZE) : pModel.totalChunks;
                    pModel.status = AppFileProcessModel.Status.PROCESSING;
                    this.callRound(pModel);
                } else {
                    pModel.file.processedPercent = processModel.percentage;
                    pModel.file.processedEstTime = processModel.estTime;
                }
            },
            complete: () => {
                processModel.file.sha256 = new Buffer(processModel.sha256.digest()).toString('hex');
                processModel.file.lastUploadId = 0;
                console.log('FILE COMPLETE: ' + processModel.file.sha256);
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
                    if (chunk.event.type === "loadstart") {
                        this.timerService.start();
                    } else if (chunk.event.type === "progress") {
                    } else if (chunk.event.type === "loadend" && chunk.event.target.readyState === FileReader.DONE) {
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
        for (let i = 0; i < this.processingFiles.length; i++) {
            if (this.processingFiles[i].sha256 === file.sha256) {
                this.processingFiles.splice(i, 1);
            }
        }
        this.uploadingFiles.push(file);
        this.endpointService.filePrepare(file).subscribe(result => {
            if (result.success) {
                for (let chunk_id = file.lastUploadId; chunk_id < Constants.FILE.NUM_SIMULTANEOUS_UPLOADS; chunk_id++) {
                    this.uploadChunk(chunk_id, file);
                }
            }
        });
    }

    uploadChunk(chunk_id: number, file: AppFileModel) {
        file.getChunk(chunk_id).subscribe({
            next: (chunk: AppFileChunkModel) => {
                if (chunk.event.type === "progress") {
                } else if (chunk.event.type === "loadend" && chunk.event.target.readyState === FileReader.DONE) {
                    const sha256 = new fastsha256.Hash();
                    sha256.update(new Uint8Array(chunk.event.target.result));
                    chunk.sha256 = new Buffer(sha256.digest()).toString('hex');
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
