import { User } from "./User";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, showSignup: () => void) => Promise<void>;
  signup: (name: string, email: string, password: string, showLogin: () => void) => Promise<void>;
  logout: () => Promise<void>;
}