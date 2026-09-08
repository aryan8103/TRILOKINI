"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ConfirmationResult,
  EmailAuthProvider,
  GoogleAuthProvider,
  RecaptchaVerifier,
  User as FirebaseUser,
  linkWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured, phoneToEmail, toE164 } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type AuthView = "login" | "signup";

export type AuthProfile = {
  id: string;
  firebaseUid: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  photoUrl?: string;
  provider?: string;
};

type AuthContextValue = {
  user: AuthProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  authOpen: boolean;
  authView: AuthView;
  openAuth: (view?: AuthView) => void;
  closeAuth: () => void;
  sendOtp: (mobile: string) => Promise<void>;
  signUp: (data: {
    fullName: string;
    mobile: string;
    otp: string;
    password: string;
    agreeToTerms: boolean;
    emailUpdates: boolean;
    whatsappUpdates: boolean;
  }) => Promise<void>;
  signIn: (mobile: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (mobile: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncProfile(idToken: string, extra?: Record<string, unknown>): Promise<AuthProfile> {
  const res = await fetch(`${API_URL}/api/auth/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(extra || {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Failed to sync profile");
  }
  return res.json();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  const ensureRecaptcha = useCallback(() => {
    if (typeof window === "undefined") throw new Error("OTP is only available in the browser");
    const auth = getFirebaseAuth();
    const existing = (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier;
    if (existing) return existing;
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier = verifier;
    return verifier;
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const token = await fbUser.getIdToken();
        const profile = await syncProfile(token, {
          fullName: fbUser.displayName,
          mobile: fbUser.phoneNumber,
        });
        setUser(profile);
      } catch {
        setUser({
          id: fbUser.uid,
          firebaseUid: fbUser.uid,
          fullName: fbUser.displayName || undefined,
          email: fbUser.email || undefined,
          mobile: fbUser.phoneNumber || undefined,
          photoUrl: fbUser.photoURL || undefined,
        });
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const sendOtp = useCallback(async (mobile: string) => {
    const auth = getFirebaseAuth();
    const verifier = ensureRecaptcha();
    const result = await signInWithPhoneNumber(auth, toE164(mobile), verifier);
    setConfirmation(result);
  }, [ensureRecaptcha]);

  const signUp = useCallback(async (data: {
    fullName: string;
    mobile: string;
    otp: string;
    password: string;
    agreeToTerms: boolean;
    emailUpdates: boolean;
    whatsappUpdates: boolean;
  }) => {
    if (!confirmation) throw new Error("Please request an OTP first");
    const credential = await confirmation.confirm(data.otp);
    const fbUser = credential.user;
    await updateProfile(fbUser, { displayName: data.fullName });
    try {
      const emailCred = EmailAuthProvider.credential(phoneToEmail(data.mobile), data.password);
      await linkWithCredential(fbUser, emailCred);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code !== "auth/provider-already-linked" && code !== "auth/email-already-in-use") {
        throw err;
      }
    }
    const token = await fbUser.getIdToken(true);
    const profile = await syncProfile(token, {
      fullName: data.fullName,
      mobile: toE164(data.mobile),
      agreeToTerms: data.agreeToTerms,
      emailUpdates: data.emailUpdates,
      whatsappUpdates: data.whatsappUpdates,
    });
    setUser(profile);
    setConfirmation(null);
    setAuthOpen(false);
  }, [confirmation]);

  const signIn = useCallback(async (mobile: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, phoneToEmail(mobile), password);
    setAuthOpen(false);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signInWithPopup(auth, new GoogleAuthProvider());
    setAuthOpen(false);
  }, []);

  const resetPassword = useCallback(async (mobile: string) => {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, phoneToEmail(mobile));
  }, []);

  const signOut = useCallback(async () => {
    if (isFirebaseConfigured()) await firebaseSignOut(getFirebaseAuth());
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      firebaseUser,
      loading,
      authOpen,
      authView,
      openAuth: (view: AuthView = "login") => {
        setAuthView(view);
        setAuthOpen(true);
      },
      closeAuth: () => setAuthOpen(false),
      sendOtp,
      signUp,
      signIn,
      signInWithGoogle,
      resetPassword,
      signOut,
    }),
    [user, firebaseUser, loading, authOpen, authView, sendOtp, signUp, signIn, signInWithGoogle, resetPassword, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
