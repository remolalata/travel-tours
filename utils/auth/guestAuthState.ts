import type { AuthViewerState } from '@/api/auth/mutations/authApi';

export const guestAuthState: AuthViewerState = {
  isAuthenticated: false,
  role: null,
  avatarUrl: null,
  fullName: null,
  email: null,
  phone: null,
};
