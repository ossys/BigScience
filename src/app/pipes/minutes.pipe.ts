import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minutes'
})
export class MinutesPipe implements PipeTransform {
    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        return minutes + 'm ' + Math.round(value - minutes * 60) + 's';
    }
}
