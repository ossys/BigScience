import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minutes'
})
export class FiletypePipe implements PipeTransform {
    transform(value: string): string {
        return 'HDF5';
    }
}
