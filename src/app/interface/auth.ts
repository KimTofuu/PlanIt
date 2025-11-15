export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fName: string;
  lName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
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
