import { Injectable } from '@angular/core';

import { StorageItem } from '../../models/storage-item';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    localStorageSupported: boolean;

    constructor() {
        console.log('INSTANTIATIED STORAGE SERVICE');
        this.localStorageSupported = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;
    }

    // add value to storage
    add(key: string, item: string) {
        if (this.localStorageSupported) {
            localStorage.setItem(key, item);
        }
    }

    // get all values from storage (all items)
    getAllItems(): Array<StorageItem> {
        var list = new Array<StorageItem>();

        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);

            list.push(new StorageItem({
                key: key,
                value: value
            }));
        }

        return list;
    }

    // get only all values from localStorage
    getAllValues(): Array<any> {
        var list = new Array<any>();

        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);

            list.push(value);
        }

        return list;
    }

    // get one item by key from storage
    get(key: string): string {
        if (this.localStorageSupported) {
            var item = localStorage.getItem(key);
            return item;
        } else {
            return null;
        }
    }

    // remove value from storage
    remove(key: string) {
        if (this.localStorageSupported) {
            localStorage.removeItem(key);
        }
    }

    // clear storage (remove all items from it)
    clear() {
        if (this.localStorageSupported) {
            localStorage.clear();
        }
    }
}