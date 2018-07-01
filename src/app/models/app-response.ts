import { Deserializable } from '../../interfaces/deserializable';

export class AppResponse implements Deserializable {
  success: boolean = false;
  message: string;
  data: any = {};
    
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}