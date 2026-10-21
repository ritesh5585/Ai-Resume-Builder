
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterUser {
  email: string;
  password: string;
  name: string;
  mobile?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface JWTpayload {
  userId: string;
  email?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  modalOpen: boolean;
  requireAuth: (action?: () => void) => void;
  closeAuth: () => void;
  login: (data: LoginUser) => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
}