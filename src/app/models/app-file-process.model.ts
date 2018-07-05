import { AppFileModel } from './app-file.model';

export class AppFileProcessModel {
    _file: AppFileModel;
    _sha256: any;
    _totalRounds: number = 0;
    _totalChunks: number = 0;
    _round: number = 0;
    _startChunk: number = 0;
    _endChunk: number = 0;
    _totalBytes: number = 0;
    _percentage: number = 0;
    _avgBytesPerSec: number = 0;
    _estTime: number = 0;

    constructor() {
    }

    get file(): AppFileModel {
        return this._file;
    }

    set file(file: AppFileModel) {
        this._file = file;
    }

    get sha256(): any {
        return this._sha256;
    }

    set sha256(sha256: any) {
        this._sha256 = sha256;
    }

    get totalRounds(): number {
        return this._totalRounds;
    }

    set totalRounds(totalRounds: number) {
        this._totalRounds = totalRounds;
    }

    get totalChunks(): number {
        return this._totalChunks;
    }

    set totalChunks(totalChunks: number) {
        this._totalChunks = totalChunks;
    }

    get round(): number {
        return this._round;
    }

    set round(round: number) {
        this._round = round;
    }

    get startChunk(): number {
        return this._startChunk;
    }

    set startChunk(startChunk: number) {
        this._startChunk = startChunk;
    }

    get endChunk(): number {
        return this._endChunk;
    }

    set endChunk(endChunk: number) {
        this._endChunk = endChunk;
    }

    get totalBytes(): number {
        return this._totalBytes;
    }

    set totalBytes(totalBytes: number) {
        this._totalBytes = totalBytes;
    }

    get percentage(): number {
        return this._percentage;
    }

    set percentage(percentage: number) {
        this._percentage = percentage;
    }

    get avgBytesPerSec(): number {
        return this._avgBytesPerSec;
    }

    set avgBytesPerSec(avgBytesPerSec: number) {
        this._avgBytesPerSec = avgBytesPerSec;
    }

    get estTime(): number {
        return this._estTime;
    }

    set estTime(estTime: number) {
        this._estTime = estTime;
    }
}