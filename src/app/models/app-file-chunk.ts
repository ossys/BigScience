export class AppFileChunk {
    
    private _event: Event;
    private _file: File;
    private _id: number;

    constructor() {
    }

    get event(): Event {
        return this._event;
    }

    set event(event: Event) {
        this._event = event;
    }

    get file(): File {
        return this._file;
    }

    set file(file: File) {
        this._file = file;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }
}
