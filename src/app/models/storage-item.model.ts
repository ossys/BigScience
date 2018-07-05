import { IStorageItem } from '../interfaces/storage-item';

export class StorageItemModel {
    key: string;
    value: any;

    constructor(data: IStorageItem) {
        this.key = data.key;
        this.value = data.value;
    }
}
