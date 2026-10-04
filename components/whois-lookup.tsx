"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import TurnstileWidget from "./turnstile";
import axios from "axios";

interface Record {
  fqdn: string;
  ownerEmail: string;
  registeredOn: string;
  username: string;
}

export function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState<Record[] | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleCaptchaCheck = async (token: string | null) => {
    if (!token) {
      setCaptchaVerified(false);
      setCaptchaToken(null);
      toast.error("Please complete the CAPTCHA");
      return;
    }

    try {
      const res = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          captchaToken: token,
        }),
      });

      if (!res.ok) {
        setCaptchaVerified(false);
        setCaptchaToken(null);
        toast.error("Captcha verification failed");
        return;
      }

      setCaptchaVerified(true);
      setCaptchaToken(token);
    } catch {
      setCaptchaVerified(false);
      setCaptchaToken(null);
      toast.error("Unable to verify CAPTCHA");
    }
  };

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedDomain = domain.trim();

    if (!trimmedDomain) {
      setMessage("Domain name is required");
      return;
    }

    if (!captchaVerified || !captchaToken) {
      setMessage("Captcha verification required");
      return;
    }

    try {
      setIsLoading(true);

      // Clear previous result/message
      setRecord(null);
      setMessage("");

      const res = await axios.get("/api/whois", {
        params: {
          domain: trimmedDomain,
          captchaToken,
        },
      });

      const whois = res.data?.whois;

      if (Array.isArray(whois) && whois.length > 0) {
        setRecord(whois);
      } else {
        setRecord([]);
        setMessage("No WHOIS record was found for this domain.");
      }
    } catch (error: unknown) {
      setRecord(null);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
            "Unable to perform WHOIS lookup."
        );
      } else {
        setMessage("Unable to perform WHOIS lookup.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const hasRecord = Boolean(record?.length);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        <section className="flex flex-1 flex-col items-center py-20 text-center sm:py-28">
          <h1 className="max-w-3xl font-sans text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Find out who&apos;s behind a domain.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Search a domain to see its registrant name,
            registration name, and contact email in one clear view.
          </p>

          <div className="mt-3 mb-0">
            <TurnstileWidget
              onVerify={(token) => {
                handleCaptchaCheck(token);
              }}
            />
          </div>

          <Card className="mt-3 w-full max-w-2xl text-left shadow-lg shadow-primary/5">
            <CardHeader className="pb-4">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
              >
                <div className="flex flex-1 flex-col gap-2">
                  <label
                    htmlFor="domain"
                    className="text-sm font-medium"
                  >
                    Domain name
                  </label>

                  <input
                    id="domain"
                    value={domain}
                    onChange={(event) => {
                      setDomain(event.target.value);

                      // If the user changes the domain,
                      // keep CAPTCHA valid because CAPTCHA
                      // is independent of the domain.
                    }}
                    placeholder="example.com"
                    autoComplete="url"
                    aria-describedby="lookup-help lookup-status"
                    aria-invalid={Boolean(message)}
                    className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !captchaVerified}
                  className="sm:mb-0 hover:cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2
                      data-icon="inline-start"
                      className="animate-spin"
                    />
                  ) : (
                    <Search data-icon="inline-start" />
                  )}

                  {isLoading
                    ? "Searching"
                    : "Look up domain"}
                </Button>
              </form>
            </CardHeader>

            {(message || record !== null) && (
              <CardContent className="border-t border-border pt-6">
                {message && !hasRecord && (
                  <p
                    id="lookup-status"
                    role="status"
                    className="text-sm text-destructive"
                  >
                    {message}
                  </p>
                )}

                {hasRecord && (
                  <div
                    id="lookup-status"
                    role="status"
                    className="flex flex-col gap-5"
                  >
                    <div
                      onClick={() => {
                        window.location.href =
                          `mailto:reportabuse@nevercode.in?subject=${encodeURIComponent(
                            `Abuse Report - ${domain}`
                          )}&body=${encodeURIComponent(
                            `Hello,

I would like to report an abuse issue regarding the domain ${domain}.

Please review this domain and take the appropriate action.

Thank you.`
                          )}`;
                      }}
                      className="ml-auto flex w-fit items-center justify-center gap-1 bg-red-700 p-1 text-sm hover:cursor-pointer hover:bg-red-600"
                    >
                      <ShieldAlert />
                      Report Abuse
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Registered Domain
                        </dt>

                        <dd className="font-sans text-sm font-medium">
                          {record?.[0]?.fqdn}
                        </dd>
                      </div>

                      <div className="flex flex-col gap-1">
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Registrant Name
                        </dt>

                        <dd className="font-sans text-sm font-medium">
                          {record?.[0]?.username}
                        </dd>
                      </div>

                      <div className="flex flex-col gap-1">
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Registrant Email
                        </dt>

                        <dd className="font-sans text-sm font-medium">
                          {record?.[0]?.ownerEmail}
                        </dd>
                      </div>

                      <div className="flex flex-col gap-1">
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Registered On
                        </dt>

                        <dd className="break-all font-sans text-sm font-medium">
                          {record?.[0]?.registeredOn}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}

                {record !== null && !hasRecord && !message && (
                  <p
                    id="lookup-status"
                    role="status"
                    className="text-sm text-destructive"
                  >
                    No WHOIS record was found for this domain.
                  </p>
                )}
              </CardContent>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}