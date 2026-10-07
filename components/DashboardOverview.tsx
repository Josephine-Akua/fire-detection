"use client";

import React from "react";
import { 
  Flame, 
  Wind, 
  Video, 
  MessageSquare, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Eye, 
  Bell, 
  Send,
  Zap,
  Wifi
} from "lucide-react";
import { IotNodeState, IncidentRecord, SmsRecord } from "@/types/fire-detection";

interface DashboardOverviewProps {
  nodes: IotNodeState[];
  currentNode: IotNodeState;
  incidents: IncidentRecord[];
  smsRecords: SmsRecord[];
  onNavigateTab: (tab: "live" | "detections" | "sms" | "hardware") => void;
  onSelectIncident: (incident: IncidentRecord) => void;
  onConfirmFire: (incidentId: string) => void;
  onMarkFalseAlarm: (incidentId: string) => void;
  onOpenSendSms: () => void;
  onSimulateTrigger: () => void;
}

export default function DashboardOverview({
  nodes,
  currentNode,
  incidents,
  smsRecords,
  onNavigateTab,
  onSelectIncident,
  onConfirmFire,
  onMarkFalseAlarm,
  onOpenSendSms,
  onSimulateTrigger,
}: DashboardOverviewProps) {
  const pendingIncident = incidents.find((inc) => inc.status === "PENDING VERIFICATION");
  const confirmedFires = incidents.filter((inc) => inc.status === "CONFIRMED FIRE").length;
  const recentIncidents = incidents.slice(0, 4);
  const recentSms = smsRecords.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase">
            <span>Threat Status</span>
            {pendingIncident ? (
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="text-xl font-bold font-mono text-white mt-2">
            {pendingIncident ? "ALERT ACTIVE" : "ALL SECURE"}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            {pendingIncident ? "Visual verification pending" : "No active fire alerts"}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase">
            <span>ESP32-CAM Nodes</span>
            <Cpu className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-2">
            {nodes.filter((n) => n.isOnline).length} / {nodes.length}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">
            100% telemetry online
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase">
            <span>SMS Dispatched</span>
            <MessageSquare className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-2">
            {smsRecords.length}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            Via SIM800L GSM + API
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase">
            <span>Confirmed Incidents</span>
            <ShieldAlert className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-2">
            {confirmedFires}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            Historically confirmed fires
          </div>
        </div>
      </div>

      {/* Main Row: Live Feed Quick Monitor & Active Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Camera Preview & Confirmatory Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden">
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold uppercase font-mono text-white">
                  ESP32-CAM Surveillance Monitor &bull; {currentNode.name}
                </span>
              </div>
              <button
                onClick={() => onNavigateTab("live")}
                className="flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white"
              >
                <span>Full Stream Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Camera View Window */}
            <div className="relative bg-black aspect-video group cursor-pointer" onClick={() => onNavigateTab("live")}>
              <img
                src={currentNode.flameSensorDetected ? "/esp32cam-fire.jpg" : "/esp32cam-normal.jpg"}
                alt="Camera Stream Preview"
                className="w-full h-full object-cover"
              />

              <div className="absolute top-3 left-3 bg-black/80 border border-zinc-800 px-2 py-1 rounded text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>LIVE FEED &bull; {currentNode.zone}</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 bg-black/85 border border-zinc-800 p-2.5 rounded flex items-center justify-between text-xs font-mono text-zinc-200">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>Flame: {currentNode.flameSensorDetected ? "ACTIVE" : "CLEAR"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-amber-400" />
                    <span>MQ-2: {currentNode.mq2Ppm} PPM</span>
                  </span>
                </div>
                <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                  Click to open interactive video stream
                </span>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="text-zinc-400">
                Resolution: SVGA 800x600 &bull; Frame: 15.4 FPS &bull; WiFi RSSI: {currentNode.wifiRssi} dBm
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onSimulateTrigger}
                  className="px-2.5 py-1 rounded border border-red-900 bg-red-950/60 text-red-300 hover:bg-red-900 text-xs font-mono transition-colors"
                >
                  Simulate Trigger
                </button>
                <button
                  onClick={() => onNavigateTab("live")}
                  className="px-3 py-1 rounded border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs font-mono transition-colors"
                >
                  Verify Live
                </button>
              </div>
            </div>
          </div>

          {/* Recent Detection Incidents Table Preview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-bold uppercase font-mono text-white">
                  Recent Detections & Incidents
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab("detections")}
                className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <span>View All ({incidents.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-zinc-800 text-xs font-mono">
              {recentIncidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="py-2.5 flex items-center justify-between gap-2 hover:bg-zinc-950/40 px-1 rounded transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onSelectIncident(incident)}
                      className="w-10 h-7 bg-black border border-zinc-800 rounded overflow-hidden shrink-0"
                    >
                      <img src={incident.snapshotUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                    <div>
                      <button
                        onClick={() => onSelectIncident(incident)}
                        className="font-bold text-white hover:underline text-left block"
                      >
                        {incident.id} &bull; {incident.location}
                      </button>
                      <span className="text-[11px] text-zinc-500">
                        {incident.timestamp} &bull; {incident.triggerType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${
                      incident.status === "CONFIRMED FIRE"
                        ? "bg-red-950 border-red-700 text-red-300 font-bold"
                        : incident.status === "PENDING VERIFICATION"
                        ? "bg-amber-950 border-amber-700 text-amber-300 animate-pulse font-bold"
                        : incident.status === "RESOLVED"
                        ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                        : "bg-zinc-900 border-zinc-700 text-zinc-400"
                    }`}>
                      {incident.status}
                    </span>
                    <button
                      onClick={() => onSelectIncident(incident)}
                      className="p-1 rounded text-zinc-400 hover:text-white"
                      title="Inspect Snapshot"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Outgoing SMS Dispatch Stream & System Telemetry */}
        <div className="space-y-4">
          {/* SMS Dispatch Feed */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-bold uppercase font-mono text-white">
                  SMS Notifications Sent
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab("sms")}
                className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <span>All Logs ({smsRecords.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentSms.map((sms) => (
                <div key={sms.id} className="bg-zinc-950 border border-zinc-800/80 rounded p-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-zinc-200">{sms.recipientName}</span>
                    <span className="text-emerald-400">{sms.status}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {sms.messageText}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1.5 pt-1 border-t border-zinc-850">
                    <span>{sms.gateway}</span>
                    <span>{sms.timestamp.substring(11)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-zinc-800">
              <button
                onClick={onOpenSendSms}
                className="w-full py-1.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Manual Test SMS</span>
              </button>
            </div>
          </div>

          {/* Quick Node Health Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4 space-y-2 text-xs font-mono">
            <h3 className="text-xs font-bold uppercase text-white mb-2 pb-1 border-b border-zinc-800">
              Hardware Health Summary
            </h3>
            <div className="flex justify-between py-1 border-b border-zinc-800/50">
              <span className="text-zinc-500">ESP32 Core Temp:</span>
              <span className="text-zinc-200">{currentNode.esp32Temp}°C</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/50">
              <span className="text-zinc-500">WiFi Strength:</span>
              <span className="text-emerald-400">{currentNode.wifiRssi} dBm</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/50">
              <span className="text-zinc-500">MQ-2 Sensitivity:</span>
              <span className="text-zinc-200">12-bit ADC / 350 PPM Threshold</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/50">
              <span className="text-zinc-500">Flame Array:</span>
              <span className="text-zinc-200">GPIO 14 Optical Interrupt</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">GSM Module:</span>
              <span className="text-zinc-200">SIM800L Connected (Slot 1)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
