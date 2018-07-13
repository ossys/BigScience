// This Interface is a Fix For Typescript Lib Bug
// https://github.com/Microsoft/TypeScript/issues/299#issuecomment-168538829
export interface FileReaderEventTarget extends EventTarget {
    result: string;
}
