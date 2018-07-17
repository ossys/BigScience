import { Observable, Observer, Subscription } from 'rxjs';

import { IDeserializable } from '../interfaces/deserializable.interface';

import { Constants } from '../constants';
import { AppFileChunkModel } from './app-file-chunk.model';

enum Status {
    PROCESSING,
    VALID,
    INVALID,
    PAUSED,
    UPLOADING,
    UPLOADED,
    CANCELED
}

export class FileModel implements IDeserializable {
    static readonly Status = Status;

    private file: File;
    private _show = true;
    private _status: Status;
    private _sha256: string;
    private _newName = '';
    private _description = '';

    private _subscription: Subscription;

    private _totalChunks = 0;
    private _processedPercent = 0;
    private _processedEstTime = 0;

    private _totalUploaded = 0;
    private _uploadPercent = 0;
    private _uploadEstTime = 0;

    private _uploads = new Array<number>();
    private _uploaded = new Array<number>();
    private _lastUploadId = -1;

    constructor() {
    }

    deserialize(file: any): this {
        this.file = file;
        return this;
    }

    /* show */
    get show(): boolean {
        return this._show;
    }

    set show(show: boolean) {
        this._show = show;
    }

    /* status */
    get status(): Status {
        return this._status;
    }

    set status(status: Status) {
        this._status = status;
    }

    /* sha256 */
    get sha256(): string {
        return this._sha256;
    }

    set sha256(sha256: string) {
        this._sha256 = sha256;
    }

    /* newName */
    get newName(): string {
        return this._newName;
    }

    set newName(newName: string) {
        this._newName = newName;
    }

    /* description */
    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    /* processingSubscription */
    get subscription(): Subscription {
        return this._subscription;
    }

    set subscription(subscription: Subscription) {
        this._subscription = subscription;
    }

    /* totalChunks */
    get totalChunks(): number {
        return this._totalChunks;
    }

    set totalChunks(totalChunks: number) {
        this._totalChunks = totalChunks;
    }

    /* processedPercent */
    get processedPercent(): number {
        return this._processedPercent;
    }

    set processedPercent(processedPercent: number) {
        this._processedPercent = processedPercent;
    }

    /* processedEstTime */
    get processedEstTime(): number {
        return this._processedEstTime;
    }

    set processedEstTime(processedEstTime: number) {
        this._processedEstTime = processedEstTime;
    }

    /* uploadPercent */
    get uploadPercent(): number {
        return this._uploadPercent;
    }

    set uploadPercent(uploadPercent: number) {
        this._uploadPercent = uploadPercent;
    }

    /* uploadEstTime */
    get uploadEstTime(): number {
        return this._uploadEstTime;
    }

    set uploadEstTime(uploadEstTime: number) {
        this._uploadEstTime = uploadEstTime;
    }

    /* name */
    get name(): string {
        return this.file.name;
    }

    /* size */
    get size(): number {
        return this.file.size;
    }

    /* type */
    get type(): string {
        return this.file.type;
    }

    /* lastModified */
    get lastModified(): number {
        return this.file.lastModified;
    }

    /* lastModifiedDate */
    get lastModifiedDate(): Date {
        return this.file.lastModifiedDate;
    }

    /* lastUploadId */
    get totalUploaded(): number {
        return this._totalUploaded;
    }

    set totalUploaded(totalUploaded: number) {
        this._totalUploaded = totalUploaded;
    }

    hasUploadId(): boolean {
        return this.totalUploaded < this.totalChunks;
    }

    setUploaded(id: number) {
        if (id === this._lastUploadId + 1) {
            const index = this._uploads.indexOf(id);
            if (index > -1) {
                this._uploads.splice(index, 1);
            }
            this._lastUploadId++;
            let testing = true;
            while (testing) {
                testing = false;
                for (let i = 0; i < this._uploaded.length; i++) {
                    if (this._uploaded[i] === this._lastUploadId + 1) {
                        this._lastUploadId++;
                        const idx = this._uploads.indexOf(this._uploaded[i]);
                        if (idx > -1) {
                            this._uploads.splice(idx, 1);
                        }
                        this._uploaded.splice(i, 1);
                        testing = true;
                    }
                }
            }
        } else {
            this._uploaded.push(id);
        }
    }

    nextUploadId(): number {
        // All chunks uploaded, return null
        if (this._lastUploadId === (this._totalChunks - 1)) {
            return -1;
        }
        if (this._uploads.length === 0) {
            this._uploads.push(0);
            console.log('RETURNING NEXT ID: ' + 0);
            console.log('UPLOADS [' + this._lastUploadId + ']: ' + this._uploads.toString());
            return 0;
        } else {
            let prev = this._lastUploadId;
            let ret = prev + 1;
            for (let i = 0; i < this._uploads.length; i++) {
                if (this._uploads[i] - prev > 1) {
                    if (ret < this._totalChunks) {
                        this._uploads.splice(i, 0, ret);
                        console.log('RETURNING NEXT ID: ' + ret);
                        console.log('UPLOADS [' + this._lastUploadId + ']: ' + this._uploads.toString());
                        return ret;
                    } else {
                        return -1;
                    }
                } else {
                    prev = this._uploads[i];
                }
            }
            ret = prev + 1;
            if (ret < this._totalChunks) {
                this._uploads.push(ret);
                console.log('RETURNING NEXT ID: ' + ret);
                console.log('UPLOADS [' + this._lastUploadId + ']: ' + this._uploads.toString());
                return ret;
            } else {
                return -1;
            }
        }
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
