const TOKEN_KEY = 'bukimind.admin.kc.token';
const REFRESH_TOKEN_KEY = 'bukimind.admin.kc.refreshToken';
const ID_TOKEN_KEY = 'bukimind.admin.kc.idToken';
const USER_KEY = 'bukimind.admin.user';
const USERNAME_KEY = 'bukimind.admin.username';

export interface StoredUser {
  login: string;
  role: 'ADMIN' | 'CUSTOMER';
}

const readJson = (key: string): StoredUser | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const tokenStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getIdToken: (): string | null => localStorage.getItem(ID_TOKEN_KEY),

  setIdToken: (token: string): void => {
    localStorage.setItem(ID_TOKEN_KEY, token);
  },

  getUser: (): StoredUser | null => readJson(USER_KEY),

  setUser: (user: StoredUser): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  getUsername: (): string | null => localStorage.getItem(USERNAME_KEY),

  setUsername: (username: string): void => {
    localStorage.setItem(USERNAME_KEY, username);
  },

  removeUsername: (): void => {
    localStorage.removeItem(USERNAME_KEY);
  },

  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USERNAME_KEY);
  },
};
