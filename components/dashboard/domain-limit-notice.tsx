"use client";

import { ExternalLink, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DomainEntitlement {
  hasStarredRepo: boolean;
  domainLimit: number;
  domainCount: number;
  domainsRemaining: number;
  limitReached: boolean;
  isGrandfatheredOverLimit: boolean;
  repository: {
    owner: string;
    name: string;
    fullName: string;
    url: string;
  };
}

interface DomainLimitNoticeProps {
  entitlement?: DomainEntitlement | null;
}

export function DomainLimitNotice({ entitlement }: DomainLimitNoticeProps) {
  if (!entitlement || entitlement.domainCount === 0) {
    return null;
  }

  if (entitlement.hasStarredRepo && !entitlement.limitReached) {
    return null;
  }

  const isGrandfathered = entitlement.isGrandfatheredOverLimit;
  const title = entitlement.hasStarredRepo
    ? "Domain limit reached"
    : isGrandfathered
      ? "Thanks for being early"
      : "Unlock more domains";
  const message = entitlement.hasStarredRepo
    ? `You have used all ${entitlement.domainLimit} domains available for starred users.`
    : isGrandfathered
      ? `You already have ${entitlement.domainCount} domains. We are keeping existing domains active while we work on sustainable free domains. A GitHub star unlocks up to 5 domains.`
      : `You have used your free domain. Star ${entitlement.repository.fullName} on GitHub to unlock up to 5 domains.`;

  return (
    <div className="rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-orange-950 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-100">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Star className="mt-0.5 size-5 shrink-0 fill-orange-400 text-orange-500" />
          <div className="space-y-1">
            <p className="font-semibold">{title}</p>
            <p className="text-sm leading-6">{message}</p>
          </div>
        </div>

        {!entitlement.hasStarredRepo && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={entitlement.repository.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="size-4" />
                Star repo
                <ExternalLink className="size-4" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/api/auth/starcheck">
                <RefreshCw className="size-4" />
                Refresh status
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
