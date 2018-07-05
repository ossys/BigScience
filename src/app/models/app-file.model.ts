import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { IDeserializable } from '../interfaces/deserializable';

import { Constants } from '../constants';
import { AppFileChunkModel } from './app-file-chunk.model';

enum Status {
    PROCESSING,
    VALID,
    INVALID,
    UPLOADING,
    UPLOADED
}

export class AppFileModel implements IDeserializable {
    static readonly Status = Status;

    private file: File;
    private _status: Status;
    private _uuid: string;
    private _sha256: string;

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

    get sha256(): string {
        return this._sha256;
    }

    set sha256(sha256: string) {
        this._sha256 = sha256;
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

    test(id: number): Observable<number> {
        return new Observable<number>((observer: Observer<number>) => {
            setTimeout(() => {
                observer.next(id);
                observer.complete();
            }, Math.round(Math.random() * (300 - 500)) + 500);
            return { unsubscribe() { console.log('UNSUB TEST'); } }
        });
    }

    getChunk(chunk_id: number): Observable<AppFileChunkModel> {
        return new Observable<AppFileChunkModel>((observer: Observer<AppFileChunkModel>) => {
            let chunk = new AppFileChunkModel();
            chunk.file = this.file;
            chunk.id = chunk_id;
            chunk.startByte = chunk_id * Constants.FILE.CHUNK_SIZE_BYTES;
            chunk.endByte = (((chunk_id + 1) * Constants.FILE.CHUNK_SIZE_BYTES));

            let reader = new FileReader();
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
                if (chunk.event.type == "loadend" && chunk.event.target.readyState == FileReader.DONE) {
                    observer.next(chunk);
                    observer.complete();
                } else {
                    observer.next(chunk);
                }
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

            reader.readAsArrayBuffer(this.file.slice(chunk.startByte, chunk.endByte));
            return { unsubscribe() { } };
        });
    }
}
