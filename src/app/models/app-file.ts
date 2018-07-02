import { Deserializable } from '../interfaces/deserializable';
import { Constants } from '../constants';
import { v4 as uuid } from 'uuid';

enum Status {
    VALID,
    INVALID,
    UPLOADING,
    UPLOADED
}

export class AppFile implements Deserializable {
    static readonly Status = Status;

    private file: File;
    private _status: Status;
    private uuid: string;

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

    get name(): string {
        return this.file.name;
    }

    get size(): number {
        return this.file.size;
    }

    get type(): string {
        return this.file.type;
    }

    startUpload() {
        this.uuid = uuid();
        let uploads: any = localStorage.getItem(Constants.LOCAL_STORAGE.UPLOADS);
        if(uploads == null) {
            console.log('CREATING UPLOADS ARRAY');
            uploads = new Array();
        }
        uploads[uuid] = {};
        localStorage.setItem(Constants.LOCAL_STORAGE.UPLOADS, uploads);
    }
    
    pauseUpload() {
    }

    resumeUpload() {
    }

    cancelUpload() {
    }

}
