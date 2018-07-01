import { Deserializable } from '../../interfaces/deserializable';

export class AppFile implements Deserializable {
    
    file: File;

    deserialize(file: any) {
        this.file = file;
        return this;
    }

    getName(): string {
        return this.file.name;
    }
}