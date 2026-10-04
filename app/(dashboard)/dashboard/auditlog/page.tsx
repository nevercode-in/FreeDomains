"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Updated Interface based on your console logs
interface AuditLog {
  _id: string;
  action: string;
  createdAt: string;
  ip?: string;           // changed from ipAddress
  userAgent?: string;
  domain?: string;       // new field
  metadata?: {           // new field for complex data
    record?: {
      name: string;
      type: string;
      content: string;
      ttl: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

/* -------------------------------- */
/* Action Formatting */
/* -------------------------------- */

const logActionMap: Record<string, string> = {
  LOGIN_SUCCESS: "Successful login",
  LOGIN_SUCESS: "Successful login", // Handling backend typo
  DELETE_RECORD: "Deleted DNS Record",
  ADD_RECORD: "Added DNS Record",
  RESTORE_DEFAULT_NAMESERVERS: "Restored Default Nameservers",
  UPDATE_NAMESERVERS: "Updated Nameservers",
  DELETE_DOMAIN: "Deleted Domain",
  CREATE_DOMAIN: "Created Domain",
};

const formatAction = (action: string) => {
  return (
    logActionMap[action] ||
    action
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

/* -------------------------------- */
/* Generate Description from Metadata */
/* -------------------------------- */

const getLogDescription = (log: AuditLog) => {
  // 1. If it involves a specific DNS record
  if (log.metadata?.record) {
    const { type, name, content } = log.metadata.record;
    if(name || name?.trim() || content || content?.trim() ){
    return `${type} record for ${name} ${content?.trim() ? "→ " + content:""}`;
    }
  }

  // 2. If it's a domain action
  if (log.domain) {
    return `Domain: ${log.domain}`;
  }

  // 3. Fallback for login or others
  if (log.action.includes("LOGIN")) {
    return log.userAgent || "User login";
  }

  return "No additional details";
};

/* -------------------------------- */
/* Accent Color */
/* -------------------------------- */

const getAccent = (action: string) => {
  if (action.includes("DELETE")) return "border-l-red-500";
  if (action.includes("CREATE") || action.includes("ADD"))
    return "border-l-green-500";
  if (action.includes("UPDATE")) return "border-l-yellow-500";
  if (action.includes("LOGIN")) return "border-l-blue-500";
  return "border-l-gray-300";
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [nextCursorDate, setNextCursorDate] = useState<Date | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const LIMIT = 10;

  const fetchLogs = async (cursor?: string,cursorDate?:Date) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const res = await axios.get("/api/my/auditlogs", {
        params: { cursor,cursorDate, limit: LIMIT },
      });
      const newLogs: AuditLog[] = res.data.data || []; // Safety fallback
      const newCursor = res.data.nextCursor;
      const newCursorDate=res.data.nextCursorDate;
      setLogs((prev) => (cursor ? [...prev, ...newLogs] : newLogs));

      setNextCursor(newCursor);
      setNextCursorDate(newCursorDate)
      setHasMore(!!newCursor);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTime = (date: string) => {
    try {
      const now = new Date();
      const created = new Date(date);
      const diff = now.getTime() - created.getTime();

      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (mins < 1) return "just now";
      if (mins < 60) return `${mins}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;

      return created.toLocaleDateString();
    } catch (e) {
      return date;
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedLog(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-sm text-muted-foreground">
          Monitor all actions performed in your account
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {logs.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              No activity logs found
            </div>
          )}

          {logs.map((log) => (
            <div
              key={log._id}
              className={`border-l-4 ${getAccent(
                log.action
              )} border rounded-xl p-5 hover:bg-muted/10 transition bg-card shadow-sm`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    {formatAction(log.action)}
                  </h3>
                  {/* Dynamic Description based on Metadata */}
                  <p className="text-sm text-muted-foreground font-mono">
                    {getLogDescription(log)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(log)}
                  className="text-xs h-8"
                >
                  View Details
                </Button>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground pt-3 mt-3 border-t">
                <span>{formatTime(log.createdAt)}</span>
                {log.ip && <span>IP: {log.ip}</span>}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => fetchLogs(nextCursor!,nextCursorDate!)}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---------------- MODAL ---------------- */}

      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 border dark:border-zinc-800">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold">
                  {formatAction(selectedLog.action)}
                </h2>
                <p className="text-xs text-muted-foreground">
                  ID: {selectedLog._id}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLog(null)}
                className="rounded-full"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4 text-sm">
              
              {/* Main Metadata Viewer (If exists) */}
              {selectedLog.metadata && (
                <div className="space-y-2">
                  <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">Metadata</span>
                  <div className="bg-zinc-100 dark:bg-zinc-950 p-3 rounded-lg border overflow-x-auto">
                    <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Standard Fields Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                
                {selectedLog.domain && (
                  <div className="col-span-2">
                    <span className="block font-medium text-xs uppercase tracking-wider text-muted-foreground">Domain</span>
                    <span>{selectedLog.domain}</span>
                  </div>
                )}

                <div className="col-span-2">
                  <span className="block font-medium text-xs uppercase tracking-wider text-muted-foreground">User Agent</span>
                  <span className="text-muted-foreground break-all">
                    {selectedLog.userAgent || "N/A"}
                  </span>
                </div>

                <div>
                  <span className="block font-medium text-xs uppercase tracking-wider text-muted-foreground">IP Address</span>
                  <span className="font-mono">{selectedLog.ip || "Unknown"}</span>
                </div>

                <div>
                  <span className="block font-medium text-xs uppercase tracking-wider text-muted-foreground">Time</span>
                  <span>{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setSelectedLog(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}