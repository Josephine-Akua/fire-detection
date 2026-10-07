"use client";

import React from "react";
import { 
  Flame, 
  ShieldAlert, 
  Radio, 
  Bell, 
  BellOff, 
  PlusCircle, 
  Send,
  Cpu,
  Wifi
} from "lucide-react";
import { IotNodeState } from "@/types/fire-detection";

interface HeaderProps {
  nodes: IotNodeState[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  hasActiveAlert: boolean;
  buzzerActive: boolean;
  onToggleBuzzer: () => void;
  onSimulateTrigger: () => void;
  onOpenSendSms: () => void;
}

export default function Header({
  nodes,
  selectedNodeId,
  onSelectNode,
  hasActiveAlert,
  buzzerActive,
  onToggleBuzzer,
  onSimulateTrigger,
  onOpenSendSms,
}: HeaderProps) {
  const currentNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-4 lg:px-8 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Brand & Telemetry Pulse */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded border ${
            hasActiveAlert 
              ? "bg-red-950/40 border-red-800 text-red-400" 
              : "bg-zinc-900 border-zinc-800 text-zinc-300"
          }`}>
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-base">
                PYROGUARD IoT
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                v2.4 ESP32-CAM
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${hasActiveAlert ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} />
              <span>{hasActiveAlert ? "ACTIVE EMERGENCY THREAT DETECTED" : "ALL SENSORS NORMAL & MONITORING"}</span>
            </p>
          </div>
        </div>

        {/* Center: Active Node Selector & Status */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded px-2.5 py-1.5 w-full md:w-auto">
          <Cpu className="w-4 h-4 text-zinc-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 uppercase font-mono leading-none">Monitored Node</span>
            <select
              value={selectedNodeId}
              onChange={(e) => onSelectNode(e.target.value)}
              className="bg-transparent text-xs font-mono text-zinc-100 focus:outline-none cursor-pointer mt-0.5"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id} className="bg-zinc-900 text-zinc-200">
                  {node.id}: {node.name} ({node.zone})
                </option>
              ))}
            </select>
          </div>
          <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-zinc-400">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentNode.wifiRssi} dBm</span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {/* Buzzer Silence / Unsilence */}
          <button
            onClick={onToggleBuzzer}
            title={buzzerActive ? "Silence Alarm Buzzer (GPIO 12)" : "Sound Alarm Siren"}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
              buzzerActive
                ? "bg-red-950 border-red-700 text-red-300 hover:bg-red-900"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
            }`}
          >
            {buzzerActive ? <Bell className="w-3.5 h-3.5 animate-pulse text-red-400" /> : <BellOff className="w-3.5 h-3.5" />}
            <span>{buzzerActive ? "Buzzer ON" : "Buzzer Muted"}</span>
          </button>

          {/* Send Manual Test SMS */}
          <button
            onClick={onOpenSendSms}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-zinc-400" />
            <span>Dispatch SMS</span>
          </button>

          {/* Simulate Sensor Trigger */}
          <button
            onClick={onSimulateTrigger}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-red-900 bg-red-950/60 text-red-300 hover:bg-red-900 hover:text-white transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simulate Fire Trigger</span>
          </button>
        </div>
      </div>
    </header>
  );
}
