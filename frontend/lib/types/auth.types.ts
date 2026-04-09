export interface FieldError {
  field: string;
  message: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiErrorResponse {
  errors?: FieldError[];
  error?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  rol: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  usuario: AuthUser;
}
