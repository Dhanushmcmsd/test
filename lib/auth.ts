export type SocialProvider =
  | "google"
  | "github"
  | "facebook"
  | "windows"
  | "passkey";

export type StoredUser = {
  name: string;
  email: string;
  passwordHash?: string;
  salt?: string;
  provider: SocialProvider | "password";
};

export type Session = {
  name: string;
  email: string;
  provider: string;
};

const USERS_KEY = "lithos.users";
const SESSION_KEY = "lithos.session";
const REMEMBER_KEY = "lithos.remember";
const AUTH_EVENT = "lithos-auth";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readUsers(): StoredUser[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function randomSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function readSession(): Session | null {
  if (!canUseStorage()) return null;
  const raw =
    localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function publish(session: Session | null) {
  window.dispatchEvent(new CustomEvent<Session | null>(AUTH_EVENT, { detail: session }));
}

function saveSession(session: Session, remember: boolean) {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  const store = remember ? localStorage : sessionStorage;
  store.setItem(SESSION_KEY, JSON.stringify(session));
  if (remember) localStorage.setItem(REMEMBER_KEY, session.email);
  publish(session);
}

export function getRememberedEmail() {
  if (!canUseStorage()) return "";
  return localStorage.getItem(REMEMBER_KEY) || "";
}

export function subscribeAuth(listener: (session: Session | null) => void) {
  const handler = (event: Event) => {
    listener((event as CustomEvent<Session | null>).detail);
  };
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists. Sign in instead.");
  }
  const salt = randomSalt();
  const user: StoredUser = {
    name,
    email,
    salt,
    passwordHash: await hashPassword(input.password, salt),
    provider: "password",
  };
  users.push(user);
  writeUsers(users);
  saveSession({ name, email, provider: "password" }, true);
}

export async function signIn(input: {
  email: string;
  password: string;
  rememberMe: boolean;
}) {
  const email = input.email.trim().toLowerCase();
  const user = readUsers().find((entry) => entry.email === email);
  if (!user) {
    throw new Error("No account found for that email. Create one with Sign Up.");
  }
  if (!user.passwordHash || !user.salt) {
    const label = user.provider === "passkey" ? "a passkey" : user.provider;
    throw new Error(`This account uses ${label} sign-in.`);
  }
  const hash = await hashPassword(input.password, user.salt);
  if (hash !== user.passwordHash) {
    throw new Error("Incorrect password.");
  }
  saveSession(
    { name: user.name, email, provider: "password" },
    input.rememberMe
  );
}

export async function resetPassword(input: {
  email: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((entry) => entry.email === email);
  if (!user) {
    throw new Error("No account found for that email.");
  }
  const salt = randomSalt();
  user.salt = salt;
  user.passwordHash = await hashPassword(input.password, salt);
  user.provider = "password";
  writeUsers(users);
  saveSession({ name: user.name, email, provider: "password" }, true);
}

export function signInWithProvider(provider: SocialProvider) {
  const email = `${provider}@users.lithos`;
  const name = provider.charAt(0).toUpperCase() + provider.slice(1);
  const users = readUsers();
  let user = users.find((entry) => entry.email === email);
  if (!user) {
    user = { name, email, provider };
    users.push(user);
    writeUsers(users);
  }
  saveSession({ name: user.name, email, provider }, true);
}

export function signOut() {
  if (!canUseStorage()) return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  publish(null);
}
