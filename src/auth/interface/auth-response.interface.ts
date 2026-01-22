export interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface BaseAuthResponse {
  message: string;
  user: UserData;
}
export interface AuthSuccessResponse extends BaseAuthResponse {
  access_token: string;
}
