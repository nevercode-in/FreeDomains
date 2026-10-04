
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  emailRedacted: boolean;
}

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedacting, setIsRedacting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login?error=Authentication Required");
          return;
        }

        const data = await res.json();
        setProfile(data.user);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign out. Please try again.");
    }
  };

  const handleRedactEmail = async () => {
    try {
      setIsRedacting(true);

      const res = await axios.post("/api/whois/redact");

      setProfile(res.data.user);

      toast.success(
        res.data.user.emailRedacted
          ? "WHOIS email privacy enabled."
          : "WHOIS email privacy disabled."
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Unable to update WHOIS privacy."
        );
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsRedacting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      await axios.delete("/api/me/delete");

      toast.success("Your account has been deleted.");

      router.push("/");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Unable to delete your account."
        );
      } else {
        toast.error(
          "Something went wrong. Please try again later."
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  /* ---------- Loading ---------- */

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent" />

          <p className="text-sm text-muted-foreground">
            Loading your settings…
          </p>
        </div>
      </div>
    );
  }

  /* ---------- Profile Error ---------- */

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-xl px-6 py-12">
        <Card>
          <CardContent className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Unable to load profile information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- Page ---------- */

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-8 sm:space-y-10">

        {/* HEADER */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Settings
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Manage your account preferences and security.
          </p>
        </header>

        {/* PROFILE INFORMATION */}
        <Card>
          <CardHeader className="px-6 py-6">
            <CardTitle>Profile Information</CardTitle>

            <CardDescription>
              Read-only account details
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="space-y-7">

              {/* Profile */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.name}
                  className="h-16 w-16 rounded-full border object-cover"
                />

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Username
                  </p>

                  <p className="font-medium">
                    {profile.name}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email Address
                </p>

                <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm font-medium break-all">
                  {profile.email}
                </div>
              </div>

              {/* WHOIS Privacy */}
              <div className="border-t pt-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    WHOIS Privacy
                  </p>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Control what information is visible in public WHOIS
                    lookups.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-4 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Make WHOIS Email Private
                    </p>

                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Don&apos;t allow your email address to be displayed
                      publicly.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRedactEmail}
                    disabled={isRedacting}
                    className="w-full sm:w-auto"
                  >
                    {isRedacting
                      ? "Updating..."
                      : profile.emailRedacted
                        ? "OFF"
                        : "ON"}
                  </Button>
                </div>
              </div>

              {/* Profile Note */}
              <p className="border-t pt-5 text-xs leading-relaxed italic text-muted-foreground">
                Profile information cannot be modified here. Contact
                support for changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* OFFICIAL CONTACTS */}
        <Card>
          <CardHeader className="px-6 py-6">
            <CardTitle>Official Communication</CardTitle>

            <CardDescription>
              Legitimate isroot.in contacts
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="grid gap-3">
              {[
                ["📧", "General Support", "support@nevercode.in"],
                ["⚠️", "Report Abuse", "reportabuse@nevercode.in"],
                ["👤", "Creator", "creator@nevercode.in"],
                ["🔒", "Security", "security@nevercode.in"],
                ["🤖", "Notifications", "no-reply@nevercode.in"],
              ].map(([icon, label, email]) => (
                <div
                  key={email}
                  className="flex items-start gap-3 rounded-lg border bg-muted/20 p-4 sm:p-5"
                >
                  <span className="mt-0.5 shrink-0 text-lg">
                    {icon}
                  </span>

                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>

                    <p className="break-all font-mono text-sm font-medium">
                      {email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SAFETY */}
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="px-6 py-6">
            <CardTitle className="flex items-center gap-2 text-destructive">
              ⚡ Safety Warning
            </CardTitle>

            <CardDescription>
              Protect your account from impersonation and phishing.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="space-y-5">
              <p className="text-sm leading-relaxed">
                We will <strong>NEVER</strong> contact you from
                non-isroot.in domains. Report fake emails immediately
                to{" "}
                <span className="font-mono font-medium text-accent">
                  reportabuse@nevercode.in
                </span>
                .
              </p>

              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "Verify sender email domains",
                  "Never share passwords or tokens",
                  "Contact support if unsure",
                  "Report suspicious emails immediately",
                ].map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 shrink-0 font-medium text-accent">
                      ✓
                    </span>

                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* ACCOUNT ACTIONS */}
        <Card>
          <CardHeader className="px-6 py-6">
            <CardTitle>Account Actions</CardTitle>

            <CardDescription>
              Manage your current session.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* DANGER ZONE */}
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="px-6 py-6">
            <CardTitle className="flex items-center gap-2 text-destructive">
              ⚠️ Danger Zone
            </CardTitle>

            <CardDescription>
              Irreversible account actions
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="rounded-lg border border-destructive/20 bg-background/50 p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div className="min-w-0 space-y-2">
                  <p className="font-medium">
                    Delete your account
                  </p>

                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Permanently delete your account and all associated
                    data. This action is irreversible and your account
                    cannot be recovered.
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full shrink-0 sm:w-auto"
                      disabled={isDeleting}
                    >
                      Delete Account
                    </Button>
                  </DialogTrigger>

                  <DialogContent showCloseButton={false}>
                    <DialogHeader>
                      <DialogTitle>Delete your account?</DialogTitle>
                      <DialogDescription>
                        This will permanently delete your account and all
                        associated data. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleDeleteAccount}
                      >
                        {isDeleting ? "Deleting..." : "Yes, delete my account"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
