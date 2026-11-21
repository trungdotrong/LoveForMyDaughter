"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";
type Loading = "password" | "google" | "guest" | null;

/** Only same-site relative paths, like the /auth/callback check. */
function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function friendlyError(message: string): string {
  if (/invalid login credentials/i.test(message)) return "Wrong email or password.";
  if (/email not confirmed/i.test(message)) return "Please confirm your email first. Check your inbox for the link.";
  if (/already registered/i.test(message)) return "This email already has an account. Sign in instead.";
  if (/anonymous/i.test(message)) return "Guest play is turned off. Enable Anonymous sign-ins in the Supabase dashboard.";
  return message;
}

const INPUT =
  "min-h-13 w-full rounded-2xl border-2 border-[#f1e6d8] bg-cream px-4 text-lg outline-none focus:border-[#ffb38a]";

export function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<Loading>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Sign-in didn't finish. Please try again." : null,
  );

  function begin(kind: Loading) {
    setLoading(kind);
    setError(null);
    setNotice(null);
  }

  function fail(message: string) {
    setError(friendlyError(message));
    setLoading(null);
  }

  function enter() {
    router.replace(next);
    router.refresh();
  }

  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    begin("password");
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      return error ? fail(error.message) : enter();
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) return fail(error.message);
    // With "Confirm email" off, Supabase signs the new user in right away.
    if (data.session) return enter();
    setNotice("Account created! Check your email and tap the link to finish signing up.");
    setMode("signin");
    setPassword("");
    setLoading(null);
  }

  async function signInWithGoogle() {
    begin("google");
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) fail(error.message);
  }

  async function signInAsGuest() {
    begin("guest");
    const { error } = await createClient().auth.signInAnonymously();
    return error ? fail(error.message) : enter();
  }

  const busy = loading !== null;

  return (
    <>
      <div className="mt-5 grid grid-cols-2 rounded-full bg-cream p-1" role="tablist">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`min-h-11 rounded-full text-base font-semibold transition-colors ${
              mode === m ? "bg-white shadow-[0_3px_0_#e9dccb]" : "text-ink-soft"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submitPassword} className="mt-4 flex flex-col gap-3 text-left">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT}
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder={mode === "signin" ? "Password" : "Password (at least 6 characters)"}
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={INPUT}
        />
        <button
          type="submit"
          disabled={busy}
          className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#ff9f6e] px-6 text-lg font-semibold text-white shadow-[0_5px_0_#e07a45] transition-transform active:translate-y-1 disabled:opacity-60"
        >
          {loading === "password" ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      {notice && <p className="mt-3 text-sm text-[#2f8a4c]">{notice}</p>}
      {error && <p className="mt-3 text-sm text-[#d9507b]">{error}</p>}

      <div className="my-5 flex items-center gap-3 text-sm text-ink-soft">
        <span className="h-px flex-1 bg-[#f1e6d8]" />
        or
        <span className="h-px flex-1 bg-[#f1e6d8]" />
      </div>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={busy}
        className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-[#f1e6d8] bg-white px-6 text-lg font-semibold shadow-[0_5px_0_#e9dccb] transition-transform active:translate-y-1 disabled:opacity-60"
      >
        <svg viewBox="0 0 48 48" className="size-6" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        {loading === "google" ? "Opening Google..." : "Sign in with Google"}
      </button>
      <button
        type="button"
        onClick={signInAsGuest}
        disabled={busy}
        className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full px-6 text-lg font-semibold text-ink-soft underline-offset-4 hover:underline disabled:opacity-60"
      >
        {loading === "guest" ? "Starting..." : "Play as guest"}
      </button>
    </>
  );
}
