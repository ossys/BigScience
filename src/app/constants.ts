export class Constants {
  public static HOST = 'http://localhost:8000';
  public static API_VERSION = '1.0';
  public static URL = {
    LOGIN: Constants.HOST + '/api/login',
    REGISTER: Constants.HOST + '/api/userprofile',
    UPLOAD: Constants.HOST + '/api/upload'
  };
  public static LOCAL_STORAGE = {
    UPLOADS: 'uploads'
  };
  public static FILE = {
    CHUNK_SIZE_BYTES: 1048576,
    ROUND_SIZE: 100
  };
}
