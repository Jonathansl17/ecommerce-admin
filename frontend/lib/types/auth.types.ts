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
