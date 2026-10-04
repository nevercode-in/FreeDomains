"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DNSRecordForm } from "@/components/dashboard/dns-record-form";
import { DNSRecordList } from "@/components/dashboard/dns-record-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
interface DNSRecord {
  id: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "MX";
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  createdAt: string;
}
type EditableRecordType = "A" | "AAAA" | "CNAME" | "MX" | "TXT";
interface records {
  content: string;
  disabled: boolean;
}
interface recordData {
  comments: string[];
  name: string;
  records: records[];
  ttl: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "SOA";
}

interface Domain {
  _id: string;
  fqdn: string;
  zoneId: string;
  customNs: "default" | "custom";
  status: "active" | "pending" | "inactive";
}

export default function DNSPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [records, setRecords] = useState<recordData[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{
    name: string;
    type: EditableRecordType;
    content: string;
  } | null>(null);
  const [savingRecord, setSavingRecord] = useState(false);
  const [pendingRecord, setPendingRecord] = useState<string | null>(null);
  const [recordSearch, setRecordSearch] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("ALL");
  const [prefillRecord, setPrefillRecord] = useState<{
    type: "A" | "AAAA" | "CNAME" | "TXT" | "MX";
    name: string;
    value: string;
    ttl: number;
    priority: number;
  } | null>(null);
  const [failedRecords, setFailedRecords] = useState<
    {
      name: string;
      type: string;
      content: string;
      ttl: number;
      priority?: number;
    }[]
  >([]);
  const [initializingZone, setInitializingZone] = useState(false);

  const [loadingDomains, setLoadingDomains] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);

  //for the notice we dont support vercel  netlify domains
  const [showPSLDialog, setShowPSLDialog] = useState(true);
  // fetching domains

  // Loads domains that the signed-in user is allowed to manage.
  const getOwnedDomains = async () => {
    try {
      setLoadingDomains(true);
      const res = await axios.get("/api/my/domains");
      setDomains(res.data);
    } catch (e: any) {
      toast.error(e.response.data.message);
    } finally {
      setLoadingDomains(false);
    }
  };

  useEffect(() => {
    getOwnedDomains();
  }, []);

  //  fetching the records

  // Refreshes PowerDNS data for the currently selected domain.
  const getRecords = async () => {
    if (!selectedDomain) return;
    try {
      setLoadingRecords(true);
      setRecords([]);
      const res = await axios.get(
        `/api/my/domains/getrecord/${selectedDomain}`,
      );
      setRecords(res.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    getRecords();
    setShowForm(false);
    setEditingRecord(null);
    setFailedRecords([]);
    setPrefillRecord(null);
    setRecordSearch("");
    setRecordTypeFilter("ALL");
  }, [selectedDomain]);

  // Creates a new value or updates the selected existing value.
  const handleSaveRecord = async (
    newRecord: Omit<DNSRecord, "id" | "createdAt">,
  ) => {
    if (!selectedDomain) return;
    try {
      setSavingRecord(true);
      const next = {
        name: newRecord.name,
        type: newRecord.type,
        value: newRecord.value,
        ttl: newRecord.ttl,
        priority: newRecord.priority,
      };
      const res = editingRecord
        ? await axios.patch(`/api/my/domains/records/${selectedDomain}`, {
            current: editingRecord,
            next,
          })
        : await axios.post("/api/my/domains/addrecord", {
            domainId: selectedDomain,
            Name: newRecord.name,
            Type: newRecord.type,
            Value: newRecord.value,
            TTL: newRecord.ttl,
            ...(newRecord.type === "MX" && { Priority: newRecord.priority }),
          });
      toast.success(res.data.message);
      setShowForm(false);
      setEditingRecord(null);
      if (prefillRecord) {
        setFailedRecords((prev) =>
          prev.filter(
            (r) =>
              !(
                r.name === prefillRecord.name &&
                r.type === prefillRecord.type &&
                r.content === prefillRecord.value
              ),
          ),
        );
        setPrefillRecord(null);
      }
      await getRecords();
    } catch (e: any) {
      toast.error(e.response?.data?.message);
    } finally {
      setSavingRecord(false);
    }
  };

  // Opens the add form with values from a record that still needs migration.
  const handlePrefill = (r: {
    name: string;
    type: string;
    content: string;
    ttl: number;
    priority?: number;
  }) => {
    const prefill = {
      type: r.type as "A" | "AAAA" | "CNAME" | "TXT" | "MX",
      name: r.name,
      value: r.content,
      ttl: r.ttl,
      priority: r.priority ?? 10,
    };
    setPrefillRecord(prefill);
    setEditingRecord(null);
    setShowForm(true);
  };

  // Converts PowerDNS's absolute name/content back into editable form fields.
  const handleEditRecord = (record: {
    name: string;
    type: EditableRecordType;
    content: string;
    ttl: number;
  }) => {
    const zone = selectedDomainData?.fqdn.replace(/\.$/, "") ?? "";
    const recordName = record.name.replace(/\.$/, "");
    const relativeName =
      recordName.toLowerCase() === zone.toLowerCase()
        ? "@"
        : recordName.slice(0, -(zone.length + 1));
    const mx =
      record.type === "MX" ? record.content.match(/^(\d+)\s+(.+)$/) : null;
    setEditingRecord({
      name: record.name,
      type: record.type,
      content: record.content,
    });
    setPrefillRecord({
      type: record.type,
      name: relativeName,
      value:
        record.type === "TXT"
          ? record.content
          : (mx?.[2] ?? record.content).replace(/\.$/, ""),
      ttl: record.ttl,
      priority: mx ? Number(mx[1]) : 10,
    });
    setShowForm(true);
  };

  //deleting the records

  // Removes a single value, then refreshes the list from PowerDNS.
  const handleDeleteRecord = async (record: any) => {
    if (!selectedDomainData?._id) {
      return toast.error("No domain selected");
    }
    const key = `${record.name}|${record.type}|${record.content}`;
    try {
      setPendingRecord(key);
      const res = await axios.patch(
        `/api/my/domains/deleterecord/${selectedDomainData._id}`,
        {
          name: record.name,
          type: record.type,
          content: record.content,
        },
      );
      toast.success(res.data.message);
    } catch (e: any) {
      toast.error(e.response?.data?.message);
    } finally {
      setPendingRecord(null);
      await getRecords();
    }
  };

  //intializing zone
  // Initializes the zone or retries parent delegation and pending migrations.
  const initializeZone = async () => {
    if (!selectedDomainData) return;
    try {
      setInitializingZone(true);
      const res = await axios.post(`/api/my/domains/zone/create`, {
        fqdn: selectedDomainData.fqdn,
      });
      if (res.data.failedRecords?.length > 0) {
        setFailedRecords(res.data.failedRecords);
        toast.warning(res.data.message);
      } else {
        setFailedRecords([]);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setInitializingZone(false);
      await Promise.all([getOwnedDomains(), getRecords()]);
    }
  };

  //for the data of the selectedd domain
  const selectedDomainData = domains.find((d) => d._id === selectedDomain);
  const canEditDNS = selectedDomainData?.customNs === "default";
  const zoneExists = !!selectedDomainData?.zoneId;
  // Filter at the value level so one matching value keeps its RRset visible.
  const visibleRecords = records.flatMap((rrset) => {
    if (recordTypeFilter !== "ALL" && rrset.type !== recordTypeFilter)
      return [];
    const matchingValues = rrset.records.filter((record) =>
      `${rrset.name} ${record.content}`
        .toLowerCase()
        .includes(recordSearch.trim().toLowerCase()),
    );
    return matchingValues.length ? [{ ...rrset, records: matchingValues }] : [];
  });

  if (loadingDomains) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Dialog open={showPSLDialog} onOpenChange={setShowPSLDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Public Suffix List Limitation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <DialogDescription asChild>
              <div className="text-sm space-y-3 text-muted-foreground">
                We currently don't support hosting on <strong>Vercel</strong>,{" "}
                <strong>Netlify</strong>, <strong>Heroku</strong>, and other
                similar platforms.
                <p className="text-foreground font-medium">Why?</p>
                <p>
                  These platforms are part of the Public Suffix List (PSL),
                  which prevents setting cookies for subdomains on their shared
                  domains. This makes DNS management incompatible.
                </p>
                <p className="text-foreground font-medium">
                  What you can use instead:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Self-hosted solutions</li>
                  <li>Virtual Private Servers (VPS)</li>
                  <li>AWS or other cloud providers</li>
                  <li>Your own domain infrastructure</li>
                </ul>
              </div>
            </DialogDescription>
          </div>
          <DialogFooter className="flex gap-2 flex-col-reverse sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="text-sm bg-transparent">
                Close
              </Button>
            </DialogClose>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm w-full sm:w-auto">
              <a
                href="https://github.com/nevercode-in/FreeDomains"
                target="_blank"
                rel="noopener noreferrer"
              >
                Promote us on GitHub
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-red-500 text-white p-4 rounded">
          DNS management is in beta — report bugs freely at
          security@nevercode.in.
        </div>

        {/* Domains */}
        <Card>
          <CardHeader>
            <CardTitle>Your Domains</CardTitle>
          </CardHeader>
          <CardContent>
            {domains.length === 0 && (
              <p className="text-center text-muted-foreground">
                No subdomains created yet.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {domains.map((domain) => (
                <button
                  key={domain._id}
                  disabled={domain.status !== "active"}
                  onClick={() => setSelectedDomain(domain._id)}
                  className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${
                    selectedDomain === domain._id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                  }
                  ${
                    domain.status !== "active"
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                >
                  <div className="font-medium truncate">{domain.fqdn}</div>

                  <p className="text-sm text-muted-foreground">
                    NS: {domain.customNs}
                  </p>

                  <span className="text-xs mt-2 inline-block px-2 py-1 rounded bg-muted">
                    {domain.status}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Records */}
        {selectedDomainData && (
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>
                DNS Records (
                {records.reduce(
                  (count, rrset) => count + rrset.records.length,
                  0,
                )}
                )
              </CardTitle>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={getRecords}
                  disabled={loadingRecords}
                  className="w-full sm:w-auto"
                >
                  {loadingRecords ? "Refreshing..." : "Refresh"}
                </Button>

                {canEditDNS && zoneExists && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={initializeZone}
                    disabled={initializingZone}
                    className="w-full sm:w-auto"
                  >
                    {initializingZone
                      ? "Checking..."
                      : "Retry setup / migration"}
                  </Button>
                )}

                {canEditDNS && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingRecord(null);
                      setPrefillRecord(null);
                      setShowForm(true);
                    }}
                    disabled={showForm}
                    className="w-full sm:w-auto"
                  >
                    Add Record
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {!canEditDNS && (
                <p className="text-sm text-muted-foreground">
                  DNS editing disabled (custom nameservers).
                  <Link
                    href={`subdomains/${selectedDomain}`}
                    className="text-accent ml-1"
                  >
                    Manage →
                  </Link>
                </p>
              )}

              {showForm && (
                <div className="mb-6">
                  <DNSRecordForm
                    onSubmit={handleSaveRecord}
                    onCancel={() => {
                      setShowForm(false);
                      setPrefillRecord(null);
                      setEditingRecord(null);
                    }}
                    initialValues={prefillRecord ?? undefined}
                    isSubmitting={savingRecord}
                    submitLabel={editingRecord ? "Save Changes" : "Add Record"}
                  />
                </div>
              )}

              {!zoneExists && (
                <div className="flex flex-col items-center">
                  <p className="text-center text-muted-foreground py-6">
                    Zone is not initialized
                  </p>
                  <Button
                    className="w-fit hover:cursor-pointer"
                    size="sm"
                    onClick={initializeZone}
                    disabled={initializingZone}
                  >
                    {initializingZone ? "Initializing..." : "Initialize zone"}
                  </Button>
                </div>
              )}

              {failedRecords.length > 0 && (
                <div className="mt-4 border border-orange-400 bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                    ⚠️ {failedRecords.length} record
                    {failedRecords.length > 1 ? "s" : ""} could not be migrated
                    automatically
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    These records remain saved. Use{" "}
                    <strong>Retry setup / migration</strong> to continue; you
                    can also add a record manually.
                  </p>
                  <div className="space-y-2">
                    {failedRecords.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white dark:bg-background border border-orange-200 dark:border-orange-800 rounded-md px-3 py-2 gap-3"
                      >
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono min-w-0">
                          <span className="font-bold text-orange-600 uppercase">
                            {r.type}
                          </span>
                          <span className="font-semibold">{r.name}</span>
                          <span
                            className="text-muted-foreground truncate max-w-55"
                            title={r.content}
                          >
                            {r.content}
                          </span>
                          <span className="text-muted-foreground">
                            TTL {r.ttl}s
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs shrink-0 border-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900 cursor-pointer"
                          onClick={() => handlePrefill(r)}
                        >
                          Add manually
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {loadingRecords && (
                <p className="text-center text-muted-foreground py-6">
                  Loading DNS records...
                </p>
              )}

              {!loadingRecords && zoneExists && records.length === 0 && (
                <p className="text-center text-muted-foreground py-6">
                  No DNS records found.
                </p>
              )}

              {zoneExists && records.length > 0 && (
                <div className="mb-4 flex flex-col sm:flex-row gap-3">
                  <input
                    value={recordSearch}
                    onChange={(event) => setRecordSearch(event.target.value)}
                    placeholder="Search record name or value"
                    className="w-full sm:flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <select
                    value={recordTypeFilter}
                    onChange={(event) =>
                      setRecordTypeFilter(event.target.value)
                    }
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="ALL">All types</option>
                    {["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA"].map(
                      (type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}
              {visibleRecords.length > 0 && (
                <DNSRecordList
                  records={visibleRecords}
                  onDelete={handleDeleteRecord}
                  onEdit={handleEditRecord}
                  pendingRecord={pendingRecord}
                  canManageDNS={canEditDNS}
                />
              )}
              {!loadingRecords &&
                records.length > 0 &&
                visibleRecords.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No records match your search.
                  </p>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
