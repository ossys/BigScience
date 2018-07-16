import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { IDeserializable } from '../interfaces/deserializable.interface';

import { Constants } from '../constants';
import { AppFileChunkModel } from './app-file-chunk.model';

enum Status {
    PROCESSING,
    VALID,
    INVALID,
    UPLOADING,
    UPLOADED
}

export class FileModel implements IDeserializable {
    static readonly Status = Status;

    private file: File;
    private _show = true;
    private _status: Status;
    private _sha256: string;
    private _newName: string;
    private _description: string;
    private _totalChunks: number;
    private _lastUploadId: number;
    private _uploads: Array<number>;
    private _processedPercent = 0;
    private _processedEstTime = 0;
    private _uploadPercent = 0;
    private _uploadEstTime = 0;

    constructor() {
    }

    deserialize(file: any): this {
        this.file = file;
        return this;
    }

    get show(): boolean {
        return this._show;
    }

    set show(show: boolean) {
        this._show = show;
    }

    get status(): Status {
        return this._status;
    }

    set status(status: Status) {
        this._status = status;
    }

    get sha256(): string {
        return this._sha256;
    }

    set sha256(sha256: string) {
        this._sha256 = sha256;
    }

    get newName(): string {
        return this._newName;
    }

    set newName(newName: string) {
        this._newName = newName;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    get totalChunks(): number {
        return this._totalChunks;
    }

    set totalChunks(totalChunks: number) {
        this._totalChunks = totalChunks;
    }

    get processedPercent(): number {
        return this._processedPercent;
    }

    set processedPercent(processedPercent: number) {
        this._processedPercent = processedPercent;
    }

    get processedEstTime(): number {
        return this._processedEstTime;
    }

    set processedEstTime(processedEstTime: number) {
        this._processedEstTime = processedEstTime;
    }

    get uploadPercent(): number {
        return this._uploadPercent;
    }

    set uploadPercent(uploadPercent: number) {
        this._uploadPercent = uploadPercent;
    }

    get uploadEstTime(): number {
        return this._uploadEstTime;
    }

    set uploadEstTime(uploadEstTime: number) {
        this._uploadEstTime = uploadEstTime;
    }

    get name(): string {
        return this.file.name;
    }

    get size(): number {
        return this.file.size;
    }

    get type(): string {
        return this.file.type;
    }

    get lastModified(): number {
        return this.file.lastModified;
    }

    get lastModifiedDate(): Date {
        return this.file.lastModifiedDate;
    }

    get lastUploadId(): number {
        return this._lastUploadId;
    }

    set lastUploadId(lastUploadId: number) {
        this._uploads = new Array<number>();
        for (let i = lastUploadId; i < Constants.FILE.NUM_SIMULTANEOUS_UPLOADS; i++) {
            this._uploads.push(i);
        }
        this._lastUploadId = lastUploadId;
    }

    getChunk(chunk_id: number): Observable<AppFileChunkModel> {
        return new Observable<AppFileChunkModel>((observer: Observer<AppFileChunkModel>) => {
            const chunk = new AppFileChunkModel();
            chunk.file = this;
            chunk.id = chunk_id;
            chunk.startByte = chunk_id * Constants.FILE.CHUNK_SIZE_BYTES;
            chunk.endByte = (((chunk_id + 1) * Constants.FILE.CHUNK_SIZE_BYTES)) <
                            chunk.file.size ? (((chunk_id + 1) * Constants.FILE.CHUNK_SIZE_BYTES)) : chunk.file.size;

            const reader = new FileReader();
            reader.onloadstart = (event) => {
                chunk.event = event;
                observer.next(chunk);
            };
            reader.onprogress = (event) => {
                chunk.event = event;
                observer.next(chunk);
            };
            reader.onload = (event) => {
                chunk.event = event;
                observer.next(chunk);
            };
            reader.onloadend = (event) => {
                chunk.event = event;
                if (chunk.event.type === 'loadend' && chunk.event.target.readyState === FileReader.DONE) {
                    observer.next(chunk);
                    observer.complete();
                } else {
                    observer.next(chunk);
                }
            };
            reader.onabort = (event) => {
                chunk.event = event;
                observer.next(chunk);
            };
            reader.onerror = (event) => {
                chunk.event = event;
                observer.error(chunk);
            };
            reader.readAsArrayBuffer(this.file.slice(chunk.startByte, chunk.endByte));

            return { unsubscribe() { } };
        });
    }
}
