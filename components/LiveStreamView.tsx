"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Camera, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sun, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Download, 
  Activity, 
  Sliders, 
  Flame, 
  Wind, 
  Cpu, 
  Radio, 
  Crosshair,
  AlertTriangle,
  Clock,
  Sparkles
} from "lucide-react";
import { IotNodeState, IncidentRecord } from "@/types/fire-detection";

interface LiveStreamViewProps {
  currentNode: IotNodeState;
  activeIncident: IncidentRecord | undefined;
  onConfirmFire: (incidentId: string) => void;
  onMarkFalseAlarm: (incidentId: string) => void;
  onToggleFlashLed: () => void;
}

export default function LiveStreamView({
  currentNode,
  activeIncident,
  onConfirmFire,
  onMarkFalseAlarm,
  onToggleFlashLed,
}: LiveStreamViewProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"video" | "snapshot">("video");
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [isFlashActive, setIsFlashActive] = useState<boolean>(currentNode.flashLedActive);
  const [snapshotSuccessToast, setSnapshotSuccessToast] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleToggleFullscreen = () => {
    const videoContainer = document.getElementById("camera-stream-container");
    if (!videoContainer) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainer.requestFullscreen();
    }
  };

  const handleTakeSnapshot = () => {
    setSnapshotSuccessToast(`Snapshot captured at ${new Date().toLocaleTimeString()} (SVGA 800x600 saved)`);
    setTimeout(() => {
      setSnapshotSuccessToast(null);
    }, 3500);
  };

  const handleFlashToggle = () => {
    setIsFlashActive(!isFlashActive);
    onToggleFlashLed();
  };

  return (
    <div className="space-y-6">
      {/* Stream Header & View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white font-mono">
              Live Feed: {currentNode.name}
            </h2>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
              {currentNode.zone}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            ESP32-CAM OV2640 RTSP/HTTP Stream &bull; IP {currentNode.ipAddress} &bull; {currentNode.cameraResolution}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex rounded border border-zinc-800 bg-zinc-950 p-1 text-xs font-mono w-full sm:w-auto">
            <button
              onClick={() => setViewMode("video")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                viewMode === "video"
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Continuous Stream</span>
            </button>
            <button
              onClick={() => setViewMode("snapshot")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                viewMode === "snapshot"
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Trigger Snapshot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Toast notification */}
      {snapshotSuccessToast && (
        <div className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-4 py-2.5 rounded text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{snapshotSuccessToast}</span>
          </div>
          <button 
            onClick={() => setSnapshotSuccessToast(null)} 
            className="text-zinc-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Stream Area + Live Telemetry Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream Canvas (2 columns on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div
            id="camera-stream-container"
            className="relative bg-black border border-zinc-800 rounded overflow-hidden aspect-video group"
          >
            {/* Flash LED illumination simulation overlay */}
            {isFlashActive && (
              <div className="absolute inset-0 bg-white/20 pointer-events-none z-10 transition-opacity" />
            )}

            {/* Video Feed */}
            {viewMode === "video" ? (
              <video
                ref={videoRef}
                src="/stream-sample.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center">
                <img
                  src={currentNode.flameSensorDetected ? "/esp32cam-fire.jpg" : "/esp32cam-normal.jpg"}
                  alt="ESP32-CAM Snapshot Capture"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Simulated Bounding Box for Fire Recognition */}
            {showBoundingBox && currentNode.flameSensorDetected && viewMode === "video" && (
              <div className="absolute top-[32%] left-[48%] w-[26%] h-[38%] border-2 border-red-500 pointer-events-none z-20">
                <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 tracking-wider uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3 text-white" />
                  <span>FLAME DETECTED 98.4%</span>
                </div>
                <div className="absolute top-1 right-1 text-[9px] font-mono text-red-300">
                  IR: HIGH
                </div>
              </div>
            )}

            {/* Top OSD Bar (Surveillance HUD) */}
            <div className="absolute top-0 inset-x-0 bg-black/80 border-b border-zinc-800 px-3 py-2 flex items-center justify-between z-20 text-[11px] font-mono text-zinc-300">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-red-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  REC
                </span>
                <span className="text-zinc-400 hidden sm:inline">
                  {currentNode.id} &bull; {currentNode.zone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 hidden sm:inline">
                  {currentNode.cameraFps} FPS
                </span>
                <span className="text-zinc-200">
                  {currentTimeStr || "2026-10-07 15:42:12 UTC"}
                </span>
              </div>
            </div>

            {/* Bottom OSD Bar (Telemetry & Overlays) */}
            <div className="absolute bottom-12 inset-x-0 bg-black/70 px-3 py-1.5 flex items-center justify-between z-20 text-[11px] font-mono text-zinc-300 border-t border-zinc-800/80">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-400" />
                  <span className={currentNode.flameSensorDetected ? "text-red-400 font-bold" : "text-emerald-400"}>
                    FLAME: {currentNode.flameSensorDetected ? "ACTIVE" : "CLEAR"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-amber-400" />
                  <span className={currentNode.mq2Ppm > currentNode.mq2Threshold ? "text-amber-400 font-bold" : "text-zinc-300"}>
                    GAS MQ-2: {currentNode.mq2Ppm} PPM
                  </span>
                </span>
                <span className="text-zinc-400 hidden sm:inline">
                  ESP TEMP: {currentNode.esp32Temp}°C
                </span>
              </div>
              <div className="text-zinc-400">
                BITRATE: 1.8 Mbps &bull; LATENCY: 110ms
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-zinc-950/95 border-t border-zinc-800 px-3 py-2 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                {viewMode === "video" && (
                  <button
                    onClick={handleTogglePlay}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    title={isPlaying ? "Pause Stream" : "Resume Stream"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={handleToggleMute}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  title={isMuted ? "Unmute Audio Alarm" : "Mute Audio Alarm"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-400" />}
                </button>

                <div className="h-4 w-px bg-zinc-800 mx-1" />

                {/* Toggle Flash LED */}
                <button
                  onClick={handleFlashToggle}
                  className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded border transition-colors ${
                    isFlashActive
                      ? "bg-amber-950 border-amber-600 text-amber-200"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Toggle ESP32-CAM High-Power White LED Flash (GPIO 4)"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Flash {isFlashActive ? "ON" : "OFF"}</span>
                </button>

                {/* Toggle Bounding Box */}
                <button
                  onClick={() => setShowBoundingBox(!showBoundingBox)}
                  className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded border transition-colors ${
                    showBoundingBox
                      ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}
                  title="Toggle Detection Bounding Box"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Target Box</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTakeSnapshot}
                  className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Capture Frame to Local System"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Snapshot</span>
                </button>

                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Operator Decision Action Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                  Visual Confirmation Protocol
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Action logs stored to incident audit
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              Verify against the live ESP32-CAM stream whether the thermal/optical signature reflects an active flame or combustible gas leak, or a benign environmental artifact (soldering flux, dust, ambient reflection).
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  if (activeIncident) {
                    onConfirmFire(activeIncident.id);
                  }
                }}
                disabled={!activeIncident || activeIncident.status !== "PENDING VERIFICATION"}
                className="flex-1 flex items-center justify-center gap-2 bg-red-950 border border-red-700 text-red-200 hover:bg-red-900 px-4 py-2.5 rounded text-xs font-mono font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4 text-red-400" />
                <span>CONFIRM ACTIVE FIRE (ALERT FIRST RESPONDERS)</span>
              </button>

              <button
                onClick={() => {
                  if (activeIncident) {
                    onMarkFalseAlarm(activeIncident.id);
                  }
                }}
                disabled={!activeIncident || activeIncident.status !== "PENDING VERIFICATION"}
                className="flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 px-4 py-2.5 rounded text-xs font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4 text-zinc-400" />
                <span>DISMISS AS FALSE ALARM</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Real-Time Sensor Telemetry & Diagnostics */}
        <div className="space-y-4">
          {/* Sensor Card 1: MQ-2 Gas & Smoke */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase font-mono text-white">MQ-2 Gas / Smoke</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                currentNode.mq2Ppm > currentNode.mq2Threshold
                  ? "bg-red-950/60 border-red-800 text-red-400 font-bold"
                  : "bg-emerald-950/40 border-emerald-800 text-emerald-400"
              }`}>
                {currentNode.mq2Ppm > currentNode.mq2Threshold ? "THRESHOLD EXCEEDED" : "NORMAL RANGE"}
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold font-mono text-white">
                {currentNode.mq2Ppm}
                <span className="text-xs font-normal text-zinc-400 ml-1">PPM</span>
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Trigger Threshold: {currentNode.mq2Threshold} PPM
              </span>
            </div>

            {/* Flat progress bar */}
            <div className="w-full bg-zinc-950 border border-zinc-800 h-2.5 rounded-sm overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-500 ${
                  currentNode.mq2Ppm > currentNode.mq2Threshold
                    ? "bg-red-600"
                    : "bg-emerald-600"
                }`}
                style={{ width: `${Math.min(100, (currentNode.mq2Ppm / 1000) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
              <div>Sensor PIN: GPIO 34 (ADC1)</div>
              <div>Sensitivity: Calibrated Rs/Ro</div>
              <div>Pre-heat: 24h Complete</div>
              <div>Gas Types: Smoke, LPG, CO</div>
            </div>
          </div>

          {/* Sensor Card 2: Optical Flame Sensor */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-xs font-semibold uppercase font-mono text-white">IR Flame Sensor</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                currentNode.flameSensorDetected
                  ? "bg-red-950/60 border-red-800 text-red-300 font-bold"
                  : "bg-emerald-950/40 border-emerald-800 text-emerald-400"
              }`}>
                {currentNode.flameSensorDetected ? "FLAME TRIGGERED" : "NO FLAME"}
              </span>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded mb-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Logic State (DO):</span>
                <span className={currentNode.flameSensorDetected ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {currentNode.flameSensorDetected ? "LOW (Active 0V)" : "HIGH (Standby 3.3V)"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono mt-2">
                <span className="text-zinc-400">Spectral Bandwidth:</span>
                <span className="text-zinc-200">760 nm — 1100 nm (Infrared)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono mt-2">
                <span className="text-zinc-400">Angle of Detection:</span>
                <span className="text-zinc-200">60° Conical Directional</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800 flex justify-between">
              <span>Hardware Interrupt Pin: GPIO 14</span>
              <span>Debounce: 50ms</span>
            </div>
          </div>

          {/* Sensor Card 3: ESP32-CAM Board Diagnostics */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold uppercase font-mono text-white">ESP32-CAM Diagnostics</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800 px-1.5 py-0.5 rounded">
                CONNECTED
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">SoC & CPU:</span>
                <span className="text-zinc-200">ESP32 Dual-Core @ 240MHz</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Memory:</span>
                <span className="text-zinc-200">4MB PSRAM / 520KB SRAM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Sensor Module:</span>
                <span className="text-zinc-200">OmniVision OV2640 (UXGA/SVGA)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">WiFi Signal:</span>
                <span className="text-emerald-400">{currentNode.wifiRssi} dBm (RSSI)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Flash LED (GPIO 4):</span>
                <span className={isFlashActive ? "text-amber-400 font-bold" : "text-zinc-400"}>
                  {isFlashActive ? "Active 100% PWM" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Firmware:</span>
                <span className="text-zinc-200">{currentNode.firmwareVersion}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
