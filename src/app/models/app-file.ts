import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { IDeserializable } from '../interfaces/deserializable';

import { Constants } from '../constants';
import { AppFileChunk } from './app-file-chunk';

enum Status {
    VALID,
    INVALID,
    UPLOADING,
    UPLOADED
}

export class AppFile implements IDeserializable {
    static readonly Status = Status;

    private file: File;
    private _status: Status;
    private _uuid: string;

    constructor() {
    }

    deserialize(file: any): this {
        this.file = file;
        return this;
    }

    get status(): Status {
        return this._status;
    }

    set status(status: Status) {
        this._status = status;
    }

    get uuid(): string {
        return this._uuid;
    }

    set uuid(uuid: string) {
        this._uuid = uuid;
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

    getChunk(chunk_id: number): Observable<AppFileChunk> {
        return new Observable<AppFileChunk>((observer: Observer<AppFileChunk>) => {
            let reader = new FileReader();
            let chunk = new AppFileChunk();
            chunk.file = this.file;
            chunk.id = chunk_id;
            reader.onerror = (event) => {
                chunk.event = event;
                observer.error(chunk);
            }
            reader.onprogress = (event) => {
                chunk.event = event;
                observer.next(chunk);
            }
            reader.onloadend = (event) => {
                chunk.event = event;
                observer.next(chunk);
                observer.complete();
            };
            reader.onabort = (event) => {
                chunk.event = event;
                observer.next(chunk);
            }
            reader.onloadstart = (event) => {
                chunk.event = event;
                observer.next(chunk);
            }
            reader.onload = (event) => {
                chunk.event = event;
                observer.next(chunk);
            }
            reader.readAsArrayBuffer(this.file.slice((chunk_id * Constants.FILE.CHUNK_SIZE_BYTES), (((chunk_id + 1) * Constants.FILE.CHUNK_SIZE_BYTES) - 1)));
            return { unsubscribe() { console.log('UNSUBSCRIBE'); } };
        });
    }
}
