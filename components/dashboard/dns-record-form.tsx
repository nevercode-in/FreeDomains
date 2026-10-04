"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface DNSRecordFormProps {
  onSubmit: (data: {
    type: "A" | "AAAA" | "CNAME" | "TXT" | "MX";
    name: string;
    value: string;
    ttl: number;
    priority?: number;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  initialValues?: {
    type: "A" | "AAAA" | "CNAME" | "TXT" | "MX";
    name: string;
    value: string;
    ttl: number;
    priority?: number;
  };
}
type DNSRecordType = "A" | "AAAA" | "CNAME" | "TXT" | "MX";

/** Shows a value example that matches the selected DNS record type. */
function getPlaceholder(type: DNSRecordType) {
  if (type === "MX") {
    return "example.postfix.com";
  }

  if (type === "A") {
    return "192.168.0.1";
  }

  if (type === "AAAA") {
    return "2001:db8::1";
  }

  if (type === "CNAME") {
    return "example.com";
  }

  if (type === "TXT") {
    return "example text";
  }

  return "";
}
/** Shared add/edit form; the parent decides which API operation to submit. */
export function DNSRecordForm({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  submitLabel = "Add Record",
}: DNSRecordFormProps) {
  const [formData, setFormData] = useState({
    type: (initialValues?.type ?? "A") as "A" | "AAAA" | "CNAME" | "TXT" | "MX",
    name: initialValues?.name ?? "@",
    value: initialValues?.value ?? "",
    ttl: initialValues?.ttl ?? 60,
    priority: initialValues?.priority ?? 10,
  });

  useEffect(() => {
    if (!initialValues) return;
    setFormData({ ...initialValues, priority: initialValues.priority ?? 10 });
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value.trim()) {
      toast.error("Please enter the value");
      return;
    }
    if (!Number.isInteger(formData.ttl) || formData.ttl < 60) {
      toast.error("TTL must be a whole number of at least 60 seconds");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Please enter a record name");
      return;
    }
    if (
      formData.type === "MX" &&
      (!Number.isInteger(formData.priority) ||
        formData.priority < 0 ||
        formData.priority > 65535)
    ) {
      toast.error("MX priority must be a whole number from 0 to 65535");
      return;
    }

    const recordData: any = {
      type: formData.type,
      name: formData.name,
      value: formData.value,
      ttl: formData.ttl,
    };

    if (formData.type === "MX") {
      recordData.priority = formData.priority;
    }
    onSubmit(recordData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Record Type
          </label>
          <select
            value={formData.type}
            disabled={isSubmitting}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "A" | "AAAA" | "CNAME" | "TXT" | "MX",
              })
            }
            className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="A">A (IPv4)</option>
            <option value="AAAA">AAAA (IPv6)</option>
            <option value="CNAME">CNAME (Alias)</option>
            <option value="MX">MX (Mail)</option>
            <option value="TXT">TXT (Text)</option>
            {/* <option value="NS">NS (Nameserver)</option> */}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Name/Host
          </label>
          <input
            type="text"
            placeholder="@ or subdomain"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
      {/* if the type of the formdata is mx it should have different field priority and value is same*/}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {formData.type === "MX" ? "MX server" : "Value"}
        </label>
        <input
          type="text"
          placeholder={getPlaceholder(formData.type)}
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {formData.type === "TXT" && (
          <p className="text-xs text-muted-foreground">
            You can add multiple TXT values with the same name.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          TTL is shared by records with the same name and type.
        </p>
      </div>
      {/* for the value of the mx record  */}
      {formData.type == "MX" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            MX Priority
          </label>
          <input
            type="number"
            placeholder="eg.10"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: Number(e.target.value) })
            }
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            TTL (seconds)
          </label>
          <input
            type="number"
            value={formData.ttl}
            onChange={(e) =>
              setFormData({
                ...formData,
                ttl:
                  e.target.value === "" ? Number.NaN : Number(e.target.value),
              })
            }
            min={60}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-border bg-transparent cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent hover:bg-accent/90 text-accent-foreground hover:cursor-pointer"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
