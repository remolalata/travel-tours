import type { AuthViewerState } from '@/services/auth/mutations/authApi';

export const guestAuthState: AuthViewerState = {
  isAuthenticated: false,
  role: null,
  avatarUrl: null,
  fullName: null,
  email: null,
  phone: null,
};
