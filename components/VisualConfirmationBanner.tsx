"use client";

import React from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Video, 
  Flame, 
  Wind, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";
import { IncidentRecord } from "@/types/fire-detection";

interface VisualConfirmationBannerProps {
  activeIncident: IncidentRecord | undefined;
  onConfirmFire: (incidentId: string) => void;
  onMarkFalseAlarm: (incidentId: string) => void;
  onViewStream: () => void;
}

export default function VisualConfirmationBanner({
  activeIncident,
  onConfirmFire,
  onMarkFalseAlarm,
  onViewStream,
}: VisualConfirmationBannerProps) {
  if (!activeIncident || activeIncident.status !== "PENDING VERIFICATION") {
    return null;
  }

  return (
    <div className="bg-red-950/30 border-y md:border md:rounded border-red-800/80 p-4 mb-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Incident info & telemetry triggers */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded bg-red-950 border border-red-700 text-red-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider bg-red-900/60 text-red-200 border border-red-700 px-2 py-0.5 rounded">
                VISUAL CONFIRMATION REQUIRED
              </span>
              <span className="text-xs font-mono text-zinc-300">
                Incident: {activeIncident.id}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {activeIncident.timestamp}
              </span>
            </div>

            <h3 className="text-sm font-medium text-white mt-1">
              IoT Sensor Trigger at {activeIncident.location}
            </h3>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-zinc-300">
              <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>Flame IR: {activeIncident.flameActive ? "DETECTED" : "CLEAR"}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                <Wind className="w-3.5 h-3.5 text-amber-400" />
                <span>MQ-2 Gas: {activeIncident.gasPpm} PPM (Spike)</span>
              </span>
              <span className="text-zinc-400">
                SMS alert sent to {activeIncident.smsCount} emergency contacts.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Decision Actions */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-end">
          <button
            onClick={onViewStream}
            className="flex items-center gap-1.5 text-xs font-mono px-3.5 py-2 rounded border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-zinc-400" />
            <span>Open ESP32 Live Feed</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          <button
            onClick={() => onMarkFalseAlarm(activeIncident.id)}
            className="flex items-center gap-1.5 text-xs font-mono px-3.5 py-2 rounded border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <XCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Mark False Alarm</span>
          </button>

          <button
            onClick={() => onConfirmFire(activeIncident.id)}
            className="flex items-center gap-1.5 text-xs font-mono px-4 py-2 rounded border border-red-700 bg-red-900 text-white hover:bg-red-800 font-semibold transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-red-200" />
            <span>CONFIRM FIRE INCIDENT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
