"use client";

import React, { useState } from "react";
import { 
  Flame, 
  Wind, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Check,
  RotateCcw
} from "lucide-react";
import { IncidentRecord, IncidentStatus } from "@/types/fire-detection";

interface PastDetectionsTableProps {
  incidents: IncidentRecord[];
  onSelectIncident: (incident: IncidentRecord) => void;
  onToggleResolve: (incidentId: string) => void;
  onViewSmsForIncident: (incidentId: string) => void;
}

export default function PastDetectionsTable({
  incidents,
  onSelectIncident,
  onToggleResolve,
  onViewSmsForIncident,
}: PastDetectionsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.nodeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || incident.status === statusFilter;

    const matchesSeverity =
      severityFilter === "ALL" || incident.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case "CONFIRMED FIRE":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-red-700 bg-red-950 text-red-300 font-bold">
            <Flame className="w-3 h-3 text-red-400" />
            CONFIRMED FIRE
          </span>
        );
      case "FALSE ALARM":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-400">
            <XCircle className="w-3 h-3 text-zinc-400" />
            FALSE ALARM
          </span>
        );
      case "PENDING VERIFICATION":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-amber-700 bg-amber-950 text-amber-300 font-semibold animate-pulse">
            <Clock className="w-3 h-3 text-amber-400" />
            PENDING VERIFICATION
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-700 bg-emerald-950 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            RESOLVED
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-red-800 bg-red-950 text-red-300 font-bold">
            CRITICAL
          </span>
        );
      case "WARNING":
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-amber-800 bg-amber-950 text-amber-300">
            WARNING
          </span>
        );
      case "ELEVATED":
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-300">
            ELEVATED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 rounded p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident ID, zone, sensor notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded pl-9 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING VERIFICATION">Pending Verification</option>
              <option value="CONFIRMED FIRE">Confirmed Fire</option>
              <option value="FALSE ALARM">False Alarm</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-400 text-[11px]">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="ELEVATED">Elevated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident List Table */}
      <div className="border border-zinc-800 rounded overflow-hidden bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Snapshot</th>
                <th className="py-2.5 px-3">Incident ID & Time</th>
                <th className="py-2.5 px-3">Location & Node</th>
                <th className="py-2.5 px-3">Trigger Telemetry</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Visual Status</th>
                <th className="py-2.5 px-3">SMS</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-xs font-mono">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500 font-mono">
                    No detection incidents match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr 
                    key={incident.id} 
                    className="hover:bg-zinc-900/40 transition-colors group"
                  >
                    {/* Snapshot Thumbnail */}
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => onSelectIncident(incident)}
                        className="relative w-14 h-9 bg-black border border-zinc-800 rounded overflow-hidden group-hover:border-zinc-700 transition-colors block"
                        title="Click to view full snapshot"
                      >
                        <img
                          src={incident.snapshotUrl}
                          alt={incident.id}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                      </button>
                    </td>

                    {/* ID & Timestamp */}
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => onSelectIncident(incident)}
                        className="font-bold text-white hover:text-zinc-300 hover:underline text-left block"
                      >
                        {incident.id}
                      </button>
                      <span className="text-[11px] text-zinc-500 block">
                        {incident.timestamp}
                      </span>
                    </td>

                    {/* Location & Node */}
                    <td className="py-2.5 px-3">
                      <span className="text-zinc-200 block">{incident.location}</span>
                      <span className="text-[11px] text-zinc-500 block">{incident.nodeName}</span>
                    </td>

                    {/* Trigger Telemetry */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Wind className="w-3 h-3 text-amber-400" />
                          <span className={incident.gasPpm > 350 ? "text-amber-300 font-bold" : "text-zinc-400"}>
                            MQ-2: {incident.gasPpm} PPM
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-3 h-3 text-red-400" />
                          <span className={incident.flameActive ? "text-red-400 font-bold" : "text-zinc-500"}>
                            Flame IR: {incident.flameActive ? "ACTIVE" : "NONE"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-2.5 px-3">
                      {getSeverityBadge(incident.severity)}
                    </td>

                    {/* Visual Confirmation Status */}
                    <td className="py-2.5 px-3">
                      {getStatusBadge(incident.status)}
                      {incident.confirmedBy && (
                        <span className="text-[10px] text-zinc-500 block mt-0.5">
                          by {incident.confirmedBy}
                        </span>
                      )}
                    </td>

                    {/* SMS Dispatched */}
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => onViewSmsForIncident(incident.id)}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded transition-colors"
                        title="View SMS notifications for this event"
                      >
                        <MessageSquare className="w-3 h-3 text-zinc-400" />
                        <span>{incident.smsCount} Sent</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectIncident(incident)}
                          className="p-1.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                          title="Inspect Evidence & Telemetry"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleResolve(incident.id)}
                          className={`p-1.5 rounded border transition-colors ${
                            incident.status === "RESOLVED"
                              ? "border-emerald-800 bg-emerald-950 text-emerald-300 hover:bg-emerald-900"
                              : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
                          }`}
                          title={incident.status === "RESOLVED" ? "Mark as Active" : "Mark as Resolved"}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
