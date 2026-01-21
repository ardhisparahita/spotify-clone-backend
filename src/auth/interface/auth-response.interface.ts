export interface AuthResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface LoginResponse extends AuthResponse {
  access_token: string;
}
