export class Constants {
  public static HOST = 'http://localhost:8000';
  public static API_VERSION = '1.0';
  public static URL = {
    LOGIN: Constants.HOST + '/api/user/login',
    REGISTER: Constants.HOST + '/api/user/register',
    FILE: Constants.HOST + '/api/file',
    CHUNK: Constants.HOST + '/api/chunk',
  };
  public static LOCAL_STORAGE = {
    UPLOADS: 'uploads',
    JWT: 'JWT'
  };
  public static FILE = {
    CHUNK_SIZE_BYTES: 1048576,
    ROUND_SIZE: 100,
    NUM_SIMULTANEOUS_UPLOADS: 10,
    RETRY_UPLOAD_DELAY_MS: 500
  };
}
