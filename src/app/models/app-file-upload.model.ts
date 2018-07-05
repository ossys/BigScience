export class AppFileUploadModel {
    private _created: Date;
    private _name: string;
    private _size: number;
    private _lastModified: Date;
    private _lastModifiedDate: Date;
    private _chunks_uploading: Array<number>;
    private _total_chunks: number;

    constructor(str: string) {
        let json = JSON.parse(str);
    }

}