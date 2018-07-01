import { Deserializable } from '../interfaces/deserializable';

enum Status {
    VALID,
    INVALID,
    UPLOADING,
    UPLOADED
}

export class AppFile implements Deserializable {
    static readonly Status = Status;
    
    private _file: File;
    private _status: Status;

    deserialize(file: any): this {
        this._file = file;
        return this;
    }

    get status(): Status {
        return this._status;
    }

    set status(status: Status) {
        this._status = status;
    }
    
    get name(): string {
        return this._file.name;
    }

}
