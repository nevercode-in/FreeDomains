"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface records {
  content: string;
  disabled: boolean;
}

interface recordData {
  comments: string[];
  name: string;
  records: records[];
  ttl: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SOA";
}
type DeletePayload = {
  name: string;
  type: recordData["type"];
  content: string;
};
type EditableRecordPayload = Omit<DeletePayload, "type"> & {
  type: Exclude<recordData["type"], "NS" | "SOA">;
  ttl: number;
};

interface DNSRecordListProps {
  records: recordData[];
  onDelete: (rec: DeletePayload) => void;
  onEdit: (rec: EditableRecordPayload) => void;
  pendingRecord?: string | null;
  canManageDNS: boolean;
}

/** Displays each RRset value as a row with value-specific edit/delete actions. */
export function DNSRecordList({
  records,
  onDelete,
  onEdit,
  pendingRecord,
  canManageDNS,
}: DNSRecordListProps) {
  //record data for delete
  const [recordData, setRecordData] = useState<{
    name: string;
    type: recordData["type"];
    content: string;
  } | null>(null);
  //for the confirming the delete

  const getRecordColor = (type: recordData["type"]) => {
    const colors: Record<recordData["type"], string> = {
      A: "bg-blue-100 text-blue-800",
      AAAA: "bg-purple-100 text-purple-800",
      CNAME: "bg-green-100 text-green-800",
      MX: "bg-orange-100 text-orange-800",
      TXT: "bg-yellow-100 text-yellow-800",
      NS: "bg-red-100 text-red-800",
      SOA: "bg-gray-100 text-gray-800",
    };
    return colors[type];
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full min-w-160">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Content</th>
              <th className="py-3 px-4 text-left">TTL</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  No DNS records created yet.
                </td>
              </tr>
            ) : (
              records.map((rec) =>
                rec.records.map((r) => (
                  <tr
                    key={`${rec.name}-${rec.type}-${r.content}`}
                    className="border-b"
                  >
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getRecordColor(rec.type)}`}
                      >
                        {rec.type}
                      </span>
                    </td>

                    <td className="py-4 px-4">{rec.name}</td>

                    <td className="py-4 px-4 font-mono text-xs wrap-break-word">
                      {r.content}
                    </td>

                    <td className="py-4 px-4">{rec.ttl}s</td>

                    <td className="py-4 px-4">
                      {!canManageDNS ||
                      rec.type === "SOA" ||
                      rec.type === "NS" ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : recordData &&
                        recordData.name === rec.name &&
                        recordData.type === rec.type &&
                        recordData.content === r.content ? (
                        <Button
                          size="sm"
                          className="bg-red-600 w-full"
                          disabled={
                            pendingRecord ===
                            `${rec.name}|${rec.type}|${r.content}`
                          }
                          onClick={() => {
                            onDelete({
                              name: rec.name,
                              type: rec.type,
                              content: r.content,
                            });
                            setRecordData(null);
                          }}
                        >
                          {pendingRecord ===
                          `${rec.name}|${rec.type}|${r.content}`
                            ? "Deleting..."
                            : "Confirm"}
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (rec.type !== "NS" && rec.type !== "SOA")
                                onEdit({
                                  name: rec.name,
                                  type: rec.type,
                                  content: r.content,
                                  ttl: Number(rec.ttl),
                                });
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() =>
                              setRecordData({
                                name: rec.name,
                                type: rec.type,
                                content: r.content,
                              })
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                )),
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 sm:hidden">
        {records.length === 0 ? (
          <div className="rounded-lg border border-border p-4 text-center">
            No DNS records created yet.
          </div>
        ) : (
          records.flatMap((rec) =>
            rec.records.map((r) => (
              <div
                key={`${rec.name}-${rec.type}-${r.content}`}
                className="rounded-lg border border-border p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getRecordColor(rec.type)}`}
                  >
                    {rec.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {rec.ttl}s TTL
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {rec.name}
                  </div>
                  <div>
                    <span className="font-medium">Content:</span>
                    <div className="font-mono wrap-break-word text-xs text-foreground mt-1">
                      {r.content}
                    </div>
                  </div>
                </div>

                {canManageDNS && rec.type !== "SOA" && rec.type !== "NS" && (
                  <div className="flex flex-col gap-2">
                    {recordData &&
                    recordData.name === rec.name &&
                    recordData.type === rec.type &&
                    recordData.content === r.content ? (
                      <Button
                        size="sm"
                        className="bg-red-600 w-full"
                        disabled={
                          pendingRecord ===
                          `${rec.name}|${rec.type}|${r.content}`
                        }
                        onClick={() => {
                          onDelete({
                            name: rec.name,
                            type: rec.type,
                            content: r.content,
                          });
                          setRecordData(null);
                        }}
                      >
                        {pendingRecord ===
                        `${rec.name}|${rec.type}|${r.content}`
                          ? "Deleting..."
                          : "Confirm"}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (rec.type !== "NS" && rec.type !== "SOA")
                              onEdit({
                                name: rec.name,
                                type: rec.type,
                                content: r.content,
                                ttl: Number(rec.ttl),
                              });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() =>
                            setRecordData({
                              name: rec.name,
                              type: rec.type,
                              content: r.content,
                            })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )),
          )
        )}
      </div>
    </div>
  );
}
