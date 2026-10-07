"use client";

import React from "react";
import { 
  Cpu, 
  Wind, 
  Flame, 
  Radio, 
  Wifi, 
  Activity, 
  Layers, 
  ShieldCheck, 
  Sun, 
  Bell, 
  Sliders, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { IotNodeState } from "@/types/fire-detection";

interface IotTelemetryPanelProps {
  currentNode: IotNodeState;
  onToggleFlashLed: () => void;
  onToggleBuzzer: () => void;
  buzzerActive: boolean;
  onSimulateTrigger: () => void;
}

export default function IotTelemetryPanel({
  currentNode,
  onToggleFlashLed,
  onToggleBuzzer,
  buzzerActive,
  onSimulateTrigger,
}: IotTelemetryPanelProps) {
  return (
    <div className="space-y-6">
      {/* Overview Top Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-base font-bold text-white font-mono">
                {currentNode.name} — Hardware & Pin Configuration
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Integrated Edge Device &bull; AI Thinker ESP32-CAM + MQ-2 Smoke/Gas + Infrared Flame Array + SIM800L GSM
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded">
              Firmware: {currentNode.firmwareVersion}
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded">
              Status: ONLINE ({currentNode.lastHeartbeat})
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core Hardware Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 1: ESP32-CAM */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase font-mono text-white">ESP32-CAM Module</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">AI-Thinker</span>
          </div>

          <div className="space-y-2 text-xs font-mono text-zinc-300">
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">SoC Core:</span>
              <span className="text-zinc-200">Xtensa Dual-Core 32-bit LX6 @ 240MHz</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Camera Sensor:</span>
              <span className="text-zinc-200">OmniVision OV2640 (2 Megapixel)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Video Encoding:</span>
              <span className="text-zinc-200">MJPEG Stream SVGA 800x600</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Static RAM:</span>
              <span className="text-zinc-200">520KB SRAM + 4MB External PSRAM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">WiFi RSSI:</span>
              <span className="text-emerald-400">{currentNode.wifiRssi} dBm (802.11 b/g/n)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Flash Illuminator:</span>
              <span className={currentNode.flashLedActive ? "text-amber-400 font-bold" : "text-zinc-300"}>
                GPIO 4 (High-Brightness White LED)
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onToggleFlashLed}
              className="w-full text-xs font-mono py-1.5 px-3 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Toggle Board LED Flash (GPIO 4)</span>
            </button>
          </div>
        </div>

        {/* Module 2: MQ-2 Gas & Smoke Sensor */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase font-mono text-white">MQ-2 Gas / Smoke Sensor</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">SnO2 Element</span>
          </div>

          <div className="space-y-2 text-xs font-mono text-zinc-300">
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Sensor Type:</span>
              <span className="text-zinc-200">Tin Dioxide (SnO2) Semiconductor</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Detectable Gases:</span>
              <span className="text-zinc-200">Smoke, LPG, Propane, Methane, Alcohol</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Analog Pin (AO):</span>
              <span className="text-zinc-200">GPIO 34 (ADC1_CH6 12-bit)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Current Reading:</span>
              <span className={currentNode.mq2Ppm > currentNode.mq2Threshold ? "text-red-400 font-bold" : "text-emerald-400"}>
                {currentNode.mq2Ppm} PPM (Threshold: {currentNode.mq2Threshold} PPM)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Preheat Voltage:</span>
              <span className="text-zinc-200">5.0V ± 0.1V @ 150mA</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Sampling Rate:</span>
              <span className="text-zinc-200">500ms Moving Average Filter</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onSimulateTrigger}
              className="w-full text-xs font-mono py-1.5 px-3 rounded border border-red-900 bg-red-950/60 hover:bg-red-900 text-red-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Smoke/Gas Spike (&gt;600 PPM)</span>
            </button>
          </div>
        </div>

        {/* Module 3: Flame Sensor & Relay */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold uppercase font-mono text-white">IR Flame Sensor & Siren</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Optoelectronic</span>
          </div>

          <div className="space-y-2 text-xs font-mono text-zinc-300">
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">IR Detector:</span>
              <span className="text-zinc-200">Silicon NPN Phototransistor</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Digital Pin (DO):</span>
              <span className="text-zinc-200">GPIO 14 (Interrupt On FALLING)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Detection Spectrum:</span>
              <span className="text-zinc-200">760 nm — 1100 nm (Flame IR)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Response Speed:</span>
              <span className="text-zinc-200">&lt; 15 microseconds</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Current Status:</span>
              <span className={currentNode.flameSensorDetected ? "text-red-400 font-bold" : "text-emerald-400"}>
                {currentNode.flameSensorDetected ? "FLAME ACTIVE (LOW)" : "CLEAR (HIGH)"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Buzzer Horn Pin:</span>
              <span className="text-zinc-200">GPIO 12 (Active High Relay 85dB)</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onToggleBuzzer}
              className={`w-full text-xs font-mono py-1.5 px-3 rounded border flex items-center justify-center gap-1.5 transition-colors ${
                buzzerActive
                  ? "border-red-700 bg-red-950 text-red-200 hover:bg-red-900"
                  : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{buzzerActive ? "Silence Siren Buzzer (GPIO 12)" : "Sound Siren Buzzer (GPIO 12)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Architecture Flow Diagram */}
      <div className="bg-zinc-900 border border-zinc-800 rounded p-5">
        <h3 className="text-xs font-bold uppercase font-mono text-zinc-300 mb-3 tracking-wider">
          Complete Edge-to-Cloud Trigger Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          {/* Step 1 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded p-3 relative">
            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Step 01 &bull; Detection</div>
            <div className="font-semibold text-white">Sensor Hardware</div>
            <p className="text-[11px] text-zinc-400 mt-1">
              MQ-2 detects smoke &gt;350 PPM or IR Phototransistor trips GPIO 14 interrupt.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded p-3 relative">
            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Step 02 &bull; Camera Capture</div>
            <div className="font-semibold text-white">ESP32-CAM Capture</div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Triggers flash LED, freezes millisecond SVGA evidence snapshot, initializes live MJPEG stream.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded p-3 relative">
            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Step 03 &bull; SMS Gateway</div>
            <div className="font-semibold text-white">SMS Broadcast</div>
            <p className="text-[11px] text-zinc-400 mt-1">
              SIM800L sends urgent SMS alerts to facility engineer, security officer, and fire department liaison.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded p-3 relative">
            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Step 04 &bull; Operator</div>
            <div className="font-semibold text-white">Visual Confirmation</div>
            <p className="text-[11px] text-zinc-400 mt-1">
              User clicks verification link from SMS, inspects live camera feed, and confirms real fire or false alarm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
