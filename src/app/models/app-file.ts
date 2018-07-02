import { Deserializable } from '../interfaces/deserializable';

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

}
