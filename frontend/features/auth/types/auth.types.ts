import { type ReactNode } from 'react';

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
  usuario: AuthUser;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export interface LoginFormProps {
  formData: LoginFormData;
  loading: boolean;
  handleChange: (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldError: (field: string) => string | undefined;
}

export interface RegisterFormProps {
  formData: RegisterFormData;
  loading: boolean;
  handleChange: (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldError: (field: string) => string | undefined;
}

export interface AuthFieldProps {
  id: string;
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}

export interface PasswordVisibilityToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export interface FormGeneralErrorProps {
  message?: string;
}
