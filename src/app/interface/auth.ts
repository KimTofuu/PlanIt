export interface LoginPayload extends Record<string, string> {
  email: string;
  password: string;
}

export interface RegisterPayload extends Record<string, string> {
  fName: string;
  lName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  ok?: boolean;
  token: string;
  user: {
    id: string;
    fName: string;
    lName: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  fName: string;
  lName: string;
  email: string;
}
