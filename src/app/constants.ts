export class Constants {
  public static HOST = 'http://localhost:8000';
  public static API_VERSION = '1.0';
  public static URL = {
    LOGIN: Constants.HOST + '/api/login',
    REGISTER: Constants.HOST + '/api/user',
    FILE_PREPARE: Constants.HOST + '/api/file/prepare',
    GET_UPLOADS: Constants.HOST + '/api/file/uploads',
    CHUNK_UPLOAD: Constants.HOST + '/api/chunk/upload',
  };
  public static LOCAL_STORAGE = {
    UPLOADS: 'uploads',
    JWT: 'JWT'
  };
  public static FILE = {
    CHUNK_SIZE_BYTES: 1048576,
    ROUND_SIZE: 100,
    NUM_SIMULTANEOUS_UPLOADS: 10
  };
}
