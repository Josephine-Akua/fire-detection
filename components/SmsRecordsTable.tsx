"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  User, 
  Radio, 
  Layers, 
  ExternalLink,
  Shield,
  Zap
} from "lucide-react";
import { SmsRecord, SmsStatus } from "@/types/fire-detection";

interface SmsRecordsTableProps {
  smsRecords: SmsRecord[];
  onOpenSendSms: () => void;
  onSelectIncidentById?: (incidentId: string) => void;
}

export default function SmsRecordsTable({
  smsRecords,
  onOpenSendSms,
  onSelectIncidentById,
}: SmsRecordsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedSmsId, setExpandedSmsId] = useState<string | null>(null);

  const filteredRecords = smsRecords.filter((record) => {
    const matchesSearch =
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recipientPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.incidentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.messageText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SmsStatus) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-800 bg-emerald-950 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            DELIVERED
          </span>
        );
      case "QUEUED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-amber-800 bg-amber-950 text-amber-300">
            <Clock className="w-3 h-3 text-amber-400" />
            QUEUED
          </span>
        );
      case "SENDING":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-blue-800 bg-blue-950 text-blue-300 animate-pulse">
            <Radio className="w-3 h-3 text-blue-400" />
            TRANSMITTING
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-red-800 bg-red-950 text-red-300">
            <AlertCircle className="w-3 h-3 text-red-400" />
            FAILED
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter, and Quick Dispatch */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 rounded p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recipient, phone number, incident ID, or SMS message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded pl-9 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-400 text-[11px]">Delivery:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Delivery Statuses</option>
              <option value="DELIVERED">Delivered</option>
              <option value="QUEUED">Queued</option>
              <option value="SENDING">Transmitting</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <button
            onClick={onOpenSendSms}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test SMS</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded p-3">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Total Outbound SMS</div>
          <div className="text-xl font-bold font-mono text-white mt-1">{smsRecords.length}</div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Cellular + API dispatch</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded p-3">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Delivered Success</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {smsRecords.filter((s) => s.status === "DELIVERED").length}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">100% gateway confirmation</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded p-3">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Primary GSM Gateway</div>
          <div className="text-sm font-bold font-mono text-zinc-200 mt-1.5 truncate">SIM800L Quad-Band</div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Signal CSQ: 24/31 (Strong)</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded p-3">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Avg SMS Latency</div>
          <div className="text-xl font-bold font-mono text-zinc-200 mt-1">
            {Math.round(smsRecords.reduce((acc, curr) => acc + curr.latencyMs, 0) / (smsRecords.length || 1))} ms
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">From trigger to carrier</div>
        </div>
      </div>

      {/* SMS Table */}
      <div className="border border-zinc-800 rounded overflow-hidden bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Message ID</th>
                <th className="py-2.5 px-3">Incident Ref</th>
                <th className="py-2.5 px-3">Recipient & Contact</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Gateway</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Dispatch Timestamp</th>
                <th className="py-2.5 px-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-xs font-mono">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500 font-mono">
                    No SMS dispatch records match the criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const isExpanded = expandedSmsId === record.id;
                  return (
                    <React.Fragment key={record.id}>
                      <tr className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {record.id}
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => onSelectIncidentById && onSelectIncidentById(record.incidentId)}
                            className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1 font-mono"
                          >
                            <span>{record.incidentId}</span>
                            <ExternalLink className="w-3 h-3 text-zinc-500" />
                          </button>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                            <User className="w-3 h-3 text-zinc-500" />
                            <span>{record.recipientName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                            <span>{record.recipientPhone}</span>
                            <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                              {record.recipientRole}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          {getStatusBadge(record.status)}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-400 text-[11px]">
                          {record.gateway}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-400">
                          {record.latencyMs}ms
                        </td>
                        <td className="py-2.5 px-3 text-zinc-400 text-[11px]">
                          {record.timestamp}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setExpandedSmsId(isExpanded ? null : record.id)}
                            className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                          >
                            {isExpanded ? "Hide" : "View SMS"}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable SMS Payload view */}
                      {isExpanded && (
                        <tr className="bg-zinc-900/60 border-b border-zinc-850">
                          <td colSpan={8} className="py-3 px-4">
                            <div className="bg-zinc-950 border border-zinc-800 rounded p-3">
                              <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                                <span className="uppercase font-mono tracking-wider text-zinc-400">
                                  Raw GSM SMS Payload Text
                                </span>
                                <span>GSM 7-bit Encoding &bull; 1 Segment</span>
                              </div>
                              <p className="text-zinc-200 font-mono text-xs leading-relaxed bg-zinc-900/70 p-2.5 rounded border border-zinc-800">
                                {record.messageText}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-400">
                                <span>Recipient: <strong className="text-zinc-200">{record.recipientName}</strong> ({record.recipientPhone})</span>
                                <span>Carrier: <strong className="text-zinc-200">{record.gateway}</strong></span>
                                <span>Dispatched: <strong className="text-zinc-200">{record.timestamp}</strong></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
