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
    public static readonly EOF = -1;

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
        // return this._uploadPercent;
        return (this._totalUploaded / this._totalChunks) * 100;
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

    setUploaded(id: number, trim: boolean) {
        // Increment the total number uploaded
        this._totalUploaded++;

        // Remove the chunk id from uploads list
        const index = this._uploads.indexOf(id);
        if (index > -1) {
            this._uploads.splice(index, 1);
        }

        let inserted = false;
        // No uploaded, go ahead and push this on the list
        if (this._uploaded.length === 0) {
            this._uploaded.push(id);
        } else {
            // Let's find where the id needs to go in numerical order
            for (let i = 0; i < this._uploaded.length - 1; i++) {
                if (id > this._uploaded[i] && id < this._uploaded[i + 1]) {
                    this._uploaded.splice(i + 1, 0, id);
                    inserted = true;
                    break;
                }
            }
            // It doesn't belong in the middle of the list
            // Let's figure out to put it at the beginning or end
            if (!inserted) {
                if (id < this._uploaded[0]) {
                    this._uploaded.unshift(id);
                } else if (id > this._uploaded[this._uploaded.length - 1]) {
                    this._uploaded.push(id);
                }
            }
            // Let's go ahead and trim the uploaded list
            // removing all consecutive values from the beginning
            if(trim) {
                let cnt = 0;
                while (this._uploaded.length > 1 && (this._uploaded[cnt + 1] - this._uploaded[cnt]) === 1) {
                    this._uploaded.shift();
                    cnt++;
                }
            }
        }
    }

    nextUploadId(): number {
        console.log('>>>>>>>>>>>>> NextUploadId >>>>>>>>>>>>>');
        console.log(this._uploaded);
        console.log(this._uploads);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        // All chunks uploaded
        if (this._totalUploaded === this._totalChunks) {
            return FileModel.EOF;
        }
        // No current uploads
        if (this._uploads.length === 0) {
            // No chunks uploaded yet
            if (this._uploaded.length === 0) {
                this._uploads.push(0);
                return 0;
            } else { // Chunks have been uploaded
                // Based on what's been uploaded, let's get the next one
                // by seeing if there are any gaps between upload ids
                for (let i = 0; i < this._uploaded.length - 1; i++) {
                    if (Math.abs(this._uploaded[i + 1] - this._uploaded[i]) > 1) {
                        this._uploads.push(this._uploaded[i] + 1);
                        return this._uploaded[i] + 1;
                    }
                }
                // No gaps, let's see if we should upload the next one after
                // the uploads list
                if (this._uploaded[this._uploaded.length - 1] < this._totalChunks) {
                    this._uploads.push(this._uploaded[this._uploaded.length - 1] + 1);
                    return this._uploaded[this._uploaded.length - 1] + 1;
                }
                // Nothing, let's return -1
                return FileModel.EOF;
            }
        } else { // There are current uploads
            // Are there 2 or more uploads? If so Let's go
            // through the uploads and see if there are gaps
            for (let i = 0; i < this._uploads.length - 1; i++) {
                // If there is a gap, and the id is not in the uploaded list
                if (Math.abs(this._uploads[i] - this._uploads[i + 1]) > 1 &&
                    this._uploaded.indexOf(this._uploads[i] + 1) === -1) {
                    if (this._uploads[i] + 1 < this._totalChunks) {
                        this._uploads.splice(i + 1, 0, this._uploads[i] + 1);
                        return this._uploads[i] + 1;
                    } else {
                        return FileModel.EOF;
                    }
                }
            }
            // No gaps, let's return one more than the last id
            // by cycling through values until we find one that
            // has not yet been uploaded
            let id = this._uploads[this._uploads.length - 1] + 1;
            while (id < this._totalChunks) {
                if (this._uploaded.indexOf(id) === -1) {
                    this._uploads.push(id);
                    return id;
                } else {
                    id++;
                }
            }

            return FileModel.EOF;
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
