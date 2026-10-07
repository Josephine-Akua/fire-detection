"use client";

import React from "react";
import { 
  X, 
  Flame, 
  Wind, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Cpu, 
  MessageSquare, 
  Download,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { IncidentRecord, SmsRecord } from "@/types/fire-detection";

interface IncidentDetailModalProps {
  incident: IncidentRecord | null;
  onClose: () => void;
  onConfirmFire: (incidentId: string) => void;
  onMarkFalseAlarm: (incidentId: string) => void;
  onToggleResolve: (incidentId: string) => void;
  smsRecords: SmsRecord[];
}

export default function IncidentDetailModal({
  incident,
  onClose,
  onConfirmFire,
  onMarkFalseAlarm,
  onToggleResolve,
  smsRecords,
}: IncidentDetailModalProps) {
  if (!incident) return null;

  const relatedSms = smsRecords.filter((s) => s.incidentId === incident.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded max-w-4xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">
                  {incident.id}
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                  incident.status === "CONFIRMED FIRE"
                    ? "bg-red-950 border-red-700 text-red-300 font-bold"
                    : incident.status === "PENDING VERIFICATION"
                    ? "bg-amber-950 border-amber-700 text-amber-300 font-bold animate-pulse"
                    : incident.status === "RESOLVED"
                    ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400"
                }`}>
                  {incident.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {incident.timestamp} &bull; {incident.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Visual Snapshot Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                <span>ESP32-CAM Visual Frame Captured At Trigger</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                Resolution: SVGA 800x600 &bull; OV2640 Lens
              </span>
            </div>

            <div className="relative bg-black border border-zinc-800 rounded overflow-hidden aspect-video">
              <img
                src={incident.snapshotUrl}
                alt={`Snapshot for ${incident.id}`}
                className="w-full h-full object-contain"
              />

              {/* Timecode overlay on image */}
              <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded border border-zinc-800 text-[11px] font-mono text-zinc-300">
                {incident.timestamp} &bull; {incident.nodeName}
              </div>

              {incident.status === "CONFIRMED FIRE" && (
                <div className="absolute top-3 right-3 bg-red-950/90 border border-red-700 px-2.5 py-1 rounded text-[11px] font-mono text-red-200 font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  VERIFIED FLAME SIGNATURE
                </div>
              )}
            </div>
          </div>

          {/* Telemetry Metrics & Trigger Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded p-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-1">
                <Wind className="w-3.5 h-3.5 text-amber-400" />
                <span>MQ-2 Gas / Smoke Sensor</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {incident.gasPpm} <span className="text-xs font-normal text-zinc-500">PPM</span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 mt-1">
                Threshold: 350 PPM ({incident.gasPpm > 350 ? "Exceeded" : "Normal"})
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded p-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-1">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>IR Flame Phototransistor</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {incident.flameActive ? "TRIGGERED (LOW)" : "CLEAR (HIGH)"}
              </div>
              <div className="text-[11px] font-mono text-zinc-500 mt-1">
                Hardware Pin: GPIO 14 (Interrupt)
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded p-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Verification Audit</span>
              </div>
              <div className="text-sm font-semibold font-mono text-zinc-200 mt-0.5">
                {incident.confirmedBy ? incident.confirmedBy : "Awaiting Operator"}
              </div>
              <div className="text-[11px] font-mono text-zinc-500 mt-1">
                {incident.confirmedAt || "Pending visual inspection"}
              </div>
            </div>
          </div>

          {/* Incident Description / Notes */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Incident Context & Event Logs
            </h4>
            <p className="text-xs font-mono text-zinc-300 leading-relaxed">
              {incident.notes}
            </p>
          </div>

          {/* SMS Broadcast Trail */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                <span>Dispatched SMS Records ({relatedSms.length})</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                Automated GSM/Twilio Broadcast
              </span>
            </div>

            <div className="border border-zinc-800 rounded overflow-hidden">
              <div className="divide-y divide-zinc-800 text-xs font-mono">
                {relatedSms.length === 0 ? (
                  <div className="p-3 text-zinc-500 text-center">No SMS records found for this incident.</div>
                ) : (
                  relatedSms.map((sms) => (
                    <div key={sms.id} className="p-3 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-200">{sms.recipientName}</span>
                          <span className="text-[11px] text-zinc-500">({sms.recipientPhone})</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                            {sms.recipientRole}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                          {sms.messageText}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-emerald-400 block font-mono">
                          {sms.status} &bull; {sms.latencyMs}ms
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {sms.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-zinc-400">
            Node: {incident.nodeName} ({incident.location})
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            {incident.status === "PENDING VERIFICATION" && (
              <>
                <button
                  onClick={() => {
                    onMarkFalseAlarm(incident.id);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded text-xs font-mono border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  Mark False Alarm
                </button>
                <button
                  onClick={() => {
                    onConfirmFire(incident.id);
                    onClose();
                  }}
                  className="px-4 py-2 rounded text-xs font-mono border border-red-700 bg-red-900 text-white hover:bg-red-800 font-bold transition-colors"
                >
                  Confirm Real Fire
                </button>
              </>
            )}

            {incident.status !== "PENDING VERIFICATION" && (
              <button
                onClick={() => {
                  onToggleResolve(incident.id);
                  onClose();
                }}
                className={`px-3.5 py-2 rounded text-xs font-mono border transition-colors ${
                  incident.status === "RESOLVED"
                    ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                    : "border-emerald-700 bg-emerald-950 text-emerald-300 hover:bg-emerald-900"
                }`}
              >
                {incident.status === "RESOLVED" ? "Reopen Incident" : "Mark as Resolved"}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded text-xs font-mono border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
