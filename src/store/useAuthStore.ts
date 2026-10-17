import { create } from 'zustand';
import type { User, UserProfile, UserRole } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  profile: UserProfile | null;
  activeRole: UserRole | string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (token: string, user: User, profile?: UserProfile, roleOverride?: string) => void;
  setActiveRole: (role: string) => void;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (permissionName: string) => boolean;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('providence_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredProfile = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem('providence_auth_profile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('providence_auth_token'),
  user: getStoredUser(),
  profile: getStoredProfile(),
  activeRole: localStorage.getItem('providence_active_role'),
  isAuthenticated: !!localStorage.getItem('providence_auth_token'),
  isLoading: false,

  login: (token, user, profile, roleOverride) => {
    const rawRole = typeof user.role === 'string' ? user.role : user.role?.name;
    const determinedRole = roleOverride || profile?.role || rawRole || 'parent';
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('providence_auth_token', token);
    localStorage.setItem('providence_auth_user', JSON.stringify(user));
    if (profile) {
      localStorage.setItem('providence_auth_profile', JSON.stringify(profile));
    }
    localStorage.setItem('providence_active_role', determinedRole);

    set({
      token,
      user,
      profile: profile || null,
      activeRole: determinedRole,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setActiveRole: (role) => {
    localStorage.setItem('providence_active_role', role);
    set({ activeRole: role });
  },

  updateUser: (updated) => {
    const current = get().user;
    if (!current) return;
    const merged = { ...current, ...updated };
    localStorage.setItem('providence_auth_user', JSON.stringify(merged));
    set({ user: merged });
  },

  hasPermission: (permissionName: string) => {
    const { user, activeRole } = get();
    if (!user) return false;
    // Admins have bypass
    if (activeRole === 'admin' || user.role?.name === 'admin') return true;
    const permissions = user.effective_permissions || [];
    return permissions.includes(permissionName);
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('providence_auth_token');
    localStorage.removeItem('providence_auth_user');
    localStorage.removeItem('providence_auth_profile');
    localStorage.removeItem('providence_active_role');
    set({
      token: null,
      user: null,
      profile: null,
      activeRole: null,
      isAuthenticated: false,
    });
  },
}));
