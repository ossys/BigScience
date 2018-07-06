export class AppFileChunkModel {
    
    private _event: Event;
    private _file: any;
    private _id: number;
    private _startByte: number;
    private _endByte: number;
    private _sha256: string;

    constructor() {
    }

    get event(): Event {
        return this._event;
    }

    set event(event: Event) {
        this._event = event;
    }

    get file(): any {
        return this._file;
    }

    set file(file: any) {
        this._file = file;
    }

    get startByte(): number {
        return this._startByte;
    }

    set startByte(startByte: number) {
        this._startByte = startByte;
    }

    get endByte(): number {
        return this._endByte;
    }

    set endByte(endByte: number) {
        this._endByte = endByte;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get sha256(): string {
        return this._sha256;
    }

    set sha256(sha256: string) {
        this._sha256 = sha256;
    }
}
