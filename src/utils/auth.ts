import { Language, User } from '../types';

export const DEFAULT_STAFF_PASSWORD = 'admin123';
export const AUTH_SESSION_VERSION = 2;

export interface StaffSessionUser extends User {
  isExplicitLogin: boolean;
  authVersion: number;
  loginRole: User['role'];
}

/**
 * Deterministic pure-JS password hash so staff credentials are not stored in
 * plaintext across state snapshots while remaining compatible with non-HTTPS
 * local network test URLs (where WebCrypto subtle may be unavailable).
 */
export function hashStaffPassword(plain: string): string {
  const salted = `rmk-staff-v2::${plain}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < salted.length; i++) {
    const c = salted.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c + (i << 5);
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `h2$${part1}${part2}`;
}

export function verifyStaffPassword(
  inputPassword: string,
  staffUser?: (User & { password?: string }) | null
): boolean {
  if (!staffUser || staffUser.role === 'customer' || !inputPassword) {
    return false;
  }

  if (staffUser.passwordHash) {
    return hashStaffPassword(inputPassword) === staffUser.passwordHash;
  }

  if (staffUser.password) {
    return inputPassword === staffUser.password;
  }

  return inputPassword === DEFAULT_STAFF_PASSWORD;
}

export function authenticateStaffCredentials(params: {
  email: string;
  password?: string;
  staffUsers: User[];
  language: Language;
}): { success: true; user: StaffSessionUser } | { success: false; message: string } {
  const { email, password = '', staffUsers, language } = params;
  const rawEmail = email.trim().toLowerCase();
  const cleanEmail = rawEmail.endsWith('@rumusky.com')
    ? rawEmail.replace(/@rumusky\.com$/, '@alphaairline.com')
    : rawEmail;

  if (!cleanEmail) {
    return {
      success: false,
      message:
        language === 'en'
          ? 'Please enter your corporate email address.'
          : 'Lütfen kurumsal e-posta adresinizi giriniz.'
    };
  }

  if (!password) {
    return {
      success: false,
      message:
        language === 'en'
          ? 'Please enter your staff password.'
          : 'Lütfen yetkili parolanızı giriniz.'
    };
  }

  const matchingStaff = staffUsers.find((u) => {
    const uEmail = u.email.trim().toLowerCase();
    return (uEmail === cleanEmail || uEmail === rawEmail) && u.role !== 'customer';
  });

  if (!matchingStaff || !verifyStaffPassword(password, matchingStaff)) {
    return {
      success: false,
      message:
        language === 'en'
          ? 'Invalid email address or password. Unauthorized access denied.'
          : 'E-posta adresi veya parola hatalı. Yetkisiz erişim reddedildi.'
    };
  }

  const sessionUser: StaffSessionUser = {
    id: matchingStaff.id,
    name: matchingStaff.name,
    surname: matchingStaff.surname,
    email: matchingStaff.email,
    role: matchingStaff.role,
    phone: matchingStaff.phone,
    isExplicitLogin: true,
    authVersion: AUTH_SESSION_VERSION,
    loginRole: matchingStaff.role
  };

  return { success: true, user: sessionUser };
}
