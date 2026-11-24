import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ABC Adventure · Privacy Policy",
  description: "How ABC Adventure handles your information.",
};

const UPDATED = "November 24, 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex flex-col gap-2 leading-relaxed text-ink">{children}</div>
    </section>
  );
}

/** Public privacy policy, linked from the Google sign-in consent screen. */
export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <Link href="/login" className="text-sm font-semibold text-ink-soft underline-offset-4 hover:underline">
          ← ABC Adventure
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-1 text-ink-soft">Last updated: {UPDATED}</p>
      </div>

      <p className="leading-relaxed">
        ABC Adventure is a small, non-commercial alphabet game made by a parent for their child. A grown-up signs in,
        then a child plays. This page explains what information the app uses and why. In short: we only use what is
        needed to sign in, and the child&apos;s game progress stays on your device.
      </p>

      <Section title="Information we collect">
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Sign-in details.</strong> When you sign in with Google, we receive your name, email address and
            profile picture from Google. If you sign up with email and password, we store your email address and a
            securely hashed password. If you play as a guest, an anonymous account with no personal details is created.
          </li>
          <li>
            <strong>Nothing else from Google.</strong> We do not access your contacts, files, calendar or any other
            Google data.
          </li>
        </ul>
      </Section>

      <Section title="Information that stays on your device">
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Game progress and settings</strong> (letters found, medals, sound and voice choices) are saved in
            your browser&apos;s local storage. They are not sent to our servers.
          </li>
          <li>
            <strong>Camera.</strong> The camera is used only to read the printed QR letter cards. Video is processed on
            your device; no images or video are recorded, stored or uploaded.
          </li>
          <li>
            <strong>Voice.</strong> Spoken words are produced by your browser&apos;s built-in speech feature. Some
            browsers use an online voice service from the browser maker to do this.
          </li>
        </ul>
      </Section>

      <Section title="How we use information">
        <p>
          Sign-in details are used only to let you into the app and keep you signed in. We do not show ads, we do not
          use analytics or tracking, and we never sell or share your information with anyone for marketing.
        </p>
      </Section>

      <Section title="Service providers">
        <p>
          Accounts and sign-in are handled by <strong>Supabase</strong> (authentication) and the app is hosted on{" "}
          <strong>Vercel</strong>. Google sign-in is provided by <strong>Google</strong>. These providers process data
          only to run these services, under their own privacy policies.
        </p>
      </Section>

      <Section title="Children">
        <p>
          The app is meant to be set up and signed in to by a parent or guardian, who then lets their child play. We do
          not knowingly collect personal information from children: the child&apos;s play happens on the device and is
          not uploaded.
        </p>
      </Section>

      <Section title="Keeping and deleting your information">
        <ul className="list-disc space-y-1 pl-6">
          <li>Your sign-in account is kept until you ask us to delete it.</li>
          <li>
            To delete game progress on a device, open <strong>Grown-up settings → Clear all progress</strong>, or clear
            this site&apos;s data in your browser.
          </li>
          <li>
            To delete your account, contact us at the support email shown on the Google sign-in screen and we will
            remove it.
          </li>
        </ul>
      </Section>

      <Section title="Changes">
        <p>If this policy changes, we will update this page and the date above.</p>
      </Section>
    </main>
  );
}
