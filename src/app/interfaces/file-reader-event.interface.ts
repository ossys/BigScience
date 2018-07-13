// This Interface is a Fix For Typescript Lib Bug
// https://github.com/Microsoft/TypeScript/issues/299#issuecomment-168538829
import { FileReaderEventTarget } from './file-reader-event-target.interface';

export interface FileReaderEvent extends ProgressEvent {
    target: FileReaderEventTarget;
    getMessage(): string;
}
