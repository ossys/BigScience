import { IDeserializable } from '../interfaces/deserializable';

export class AppResponseModel implements IDeserializable {
  success: boolean = false;
  message: string;
  data: any = {};
    
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}