const USER_KEY = 'ob_user';
const ADMIN_KEY = 'ob_admin';

// ── User Session ──────────────────────────────────────────────────────────────

export const saveUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const clearUser = () =>
  localStorage.removeItem(USER_KEY);

export const isLoggedIn = () => !!getUser();

// ── Admin Session ─────────────────────────────────────────────────────────────

export const saveAdmin = (admin) =>
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));

export const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY));
  } catch {
    return null;
  }
};

export const clearAdmin = () =>
  localStorage.removeItem(ADMIN_KEY);

export const isAdminLoggedIn = () => !!getAdmin();
