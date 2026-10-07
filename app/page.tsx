"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import VisualConfirmationBanner from "@/components/VisualConfirmationBanner";
import LiveStreamView from "@/components/LiveStreamView";
import PastDetectionsTable from "@/components/PastDetectionsTable";
import SmsRecordsTable from "@/components/SmsRecordsTable";
import IotTelemetryPanel from "@/components/IotTelemetryPanel";
import DashboardOverview from "@/components/DashboardOverview";
import IncidentDetailModal from "@/components/IncidentDetailModal";
import SendTestSmsModal from "@/components/SendTestSmsModal";

import { 
  initialIotNodes, 
  initialIncidents, 
  initialSmsRecords 
} from "@/lib/mock-data";
import { 
  IotNodeState, 
  IncidentRecord, 
  SmsRecord 
} from "@/types/fire-detection";

import { 
  LayoutDashboard, 
  Video, 
  ShieldAlert, 
  MessageSquare, 
  Cpu, 
  Radio, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Info
} from "lucide-react";

type ActiveTab = "overview" | "live" | "detections" | "sms" | "hardware";

export default function Home() {
  const [nodes, setNodes] = useState<IotNodeState[]>(initialIotNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("NODE-01");
  const [incidents, setIncidents] = useState<IncidentRecord[]>(initialIncidents);
  const [smsRecords, setSmsRecords] = useState<SmsRecord[]>(initialSmsRecords);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [buzzerActive, setBuzzerActive] = useState<boolean>(true);
  const [selectedIncidentModal, setSelectedIncidentModal] = useState<IncidentRecord | null>(null);
  const [isSendSmsModalOpen, setIsSendSmsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const pendingIncident = incidents.find((inc) => inc.status === "PENDING VERIFICATION");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle buzzer relay (GPIO 12)
  const handleToggleBuzzer = () => {
    setBuzzerActive(!buzzerActive);
    showToast(!buzzerActive ? "Emergency Alarm Siren Activated (GPIO 12 HIGH)" : "Alarm Buzzer Muted (GPIO 12 LOW)");
  };

  // Toggle Flash LED (GPIO 4)
  const handleToggleFlashLed = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNodeId ? { ...n, flashLedActive: !n.flashLedActive } : n
      )
    );
    showToast(`ESP32-CAM Board Flash LED toggled for ${selectedNodeId}`);
  };

  // Operator confirms fire from visual stream
  const handleConfirmFire = (incidentId: string) => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: "CONFIRMED FIRE",
              confirmedBy: "Operator J. Akua (Visual Confirmed)",
              confirmedAt: nowStr,
            }
          : inc
      )
    );

    // Dispatch automatic follow-up emergency broadcast SMS
    const newEmergencySms: SmsRecord = {
      id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
      incidentId: incidentId,
      recipientName: "Captain Mark Davis (Fire Dept)",
      recipientPhone: "+1 (555) 019-2834",
      recipientRole: "Fire Department Liaison",
      timestamp: nowStr,
      status: "DELIVERED",
      messageText: `[CONFIRMED FIRE - LEVEL 1] Visual confirmation verified by operator for ${incidentId} at ${currentNode.zone}. Responders mobilized.`,
      gateway: "Twilio Cloud SMS API (Priority)",
      latencyMs: 510,
    };

    setSmsRecords((prev) => [newEmergencySms, ...prev]);
    showToast(`Incident ${incidentId} CONFIRMED! Emergency broadcast dispatched via SMS.`);
  };

  // Operator marks incident as false alarm
  const handleMarkFalseAlarm = (incidentId: string) => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: "FALSE ALARM",
              confirmedBy: "Operator J. Akua (Visual Checked)",
              confirmedAt: nowStr,
            }
          : inc
      )
    );

    // Reset node telemetry
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNodeId
          ? {
              ...n,
              flameSensorDetected: false,
              mq2Ppm: 125,
              buzzerActive: false,
            }
          : n
      )
    );
    setBuzzerActive(false);

    // Dispatch all clear SMS
    const newClearSms: SmsRecord = {
      id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
      incidentId: incidentId,
      recipientName: "Josephine Akua",
      recipientPhone: "+1 (555) 018-4721",
      recipientRole: "Facility Lead Engineer",
      timestamp: nowStr,
      status: "DELIVERED",
      messageText: `[FALSE ALARM CLEARED] Visual inspection of ${incidentId} via ESP32-CAM confirmed no flame or threat. System restored.`,
      gateway: "SIM800L GSM (Cellular Quad-Band)",
      latencyMs: 910,
    };

    setSmsRecords((prev) => [newClearSms, ...prev]);
    showToast(`Incident ${incidentId} marked as FALSE ALARM. Sensors & buzzer reset.`);
  };

  // Toggle resolve status
  const handleToggleResolve = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const nextStatus = inc.status === "RESOLVED" ? "CONFIRMED FIRE" : "RESOLVED";
          return { ...inc, status: nextStatus };
        }
        return inc;
      })
    );
    showToast(`Incident status updated for ${incidentId}.`);
  };

  // Simulate a live sensor trigger (Gas spike + Flame detection + SMS dispatch)
  const handleSimulateTrigger = () => {
    const newId = `INC-${new Date().getFullYear()}-${Math.floor(1050 + Math.random() * 500)}`;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    // Update node telemetry to alarmed state
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNodeId
          ? {
              ...n,
              flameSensorDetected: true,
              mq2Ppm: Math.floor(650 + Math.random() * 200),
              buzzerActive: true,
            }
          : n
      )
    );
    setBuzzerActive(true);

    // Create incident
    const newIncident: IncidentRecord = {
      id: newId,
      timestamp: nowStr,
      nodeId: currentNode.id,
      nodeName: currentNode.name,
      location: currentNode.zone,
      triggerType: "DUAL TRIGGER (FLAME + SMOKE)",
      gasPpm: 715,
      flameActive: true,
      severity: "CRITICAL",
      status: "PENDING VERIFICATION",
      snapshotUrl: "/esp32cam-fire.jpg",
      notes: `Simulated trigger on ${currentNode.name}: IR Flame Sensor tripped and MQ-2 Gas sensor spiked to 715 PPM. SMS alert broadcast to security list.`,
      smsCount: 2,
    };

    // Create 2 immediate SMS records
    const sms1: SmsRecord = {
      id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
      incidentId: newId,
      recipientName: "Captain Mark Davis",
      recipientPhone: "+1 (555) 019-2834",
      recipientRole: "Fire Department Liaison",
      timestamp: nowStr,
      status: "DELIVERED",
      messageText: `[CRITICAL FIRE ALERT] IoT Node ${currentNode.id} detected FLAME and SMOKE at ${currentNode.zone}. Visual verify: https://pyrowatch.local/verify/${newId}`,
      gateway: "SIM800L GSM (Cellular Quad-Band)",
      latencyMs: 820,
    };

    const sms2: SmsRecord = {
      id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
      incidentId: newId,
      recipientName: "Josephine Akua",
      recipientPhone: "+1 (555) 018-4721",
      recipientRole: "Facility Lead Engineer",
      timestamp: nowStr,
      status: "DELIVERED",
      messageText: `[CRITICAL FIRE ALERT] IoT Node ${currentNode.id} detected FLAME and SMOKE at ${currentNode.zone}. Visual verify: https://pyrowatch.local/verify/${newId}`,
      gateway: "SIM800L GSM (Cellular Quad-Band)",
      latencyMs: 940,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setSmsRecords((prev) => [sms1, sms2, ...prev]);
    setActiveTab("live");
    showToast(`Simulation started! Incident ${newId} logged, SMS sent, live stream activated.`);
  };

  const handleAddNewSms = (newSms: SmsRecord) => {
    setSmsRecords((prev) => [newSms, ...prev]);
    showToast(`SMS ${newSms.id} successfully transmitted via ${newSms.gateway}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* System Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-zinc-700 text-zinc-200 px-4 py-3 rounded text-xs font-mono shadow-xl flex items-center gap-2">
          <Info className="w-4 h-4 text-zinc-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        hasActiveAlert={Boolean(pendingIncident)}
        buzzerActive={buzzerActive}
        onToggleBuzzer={handleToggleBuzzer}
        onSimulateTrigger={handleSimulateTrigger}
        onOpenSendSms={() => setIsSendSmsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Visual Confirmation Banner (Shown when an incident is pending confirmation) */}
        <VisualConfirmationBanner
          activeIncident={pendingIncident}
          onConfirmFire={handleConfirmFire}
          onMarkFalseAlarm={handleMarkFalseAlarm}
          onViewStream={() => setActiveTab("live")}
        />

        {/* Minimalist Navigation Bar / Tabs */}
        <div className="flex items-center gap-1 border-b border-zinc-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono transition-colors whitespace-nowrap relative ${
              activeTab === "live"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>ESP32-CAM Live Stream</span>
            {pendingIncident && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("detections")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono transition-colors whitespace-nowrap ${
              activeTab === "detections"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Past Detections Log ({incidents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("sms")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono transition-colors whitespace-nowrap ${
              activeTab === "sms"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS Notifications Sent ({smsRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hardware")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono transition-colors whitespace-nowrap ${
              activeTab === "hardware"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>IoT Sensors & Hardware</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === "overview" && (
          <DashboardOverview
            nodes={nodes}
            currentNode={currentNode}
            incidents={incidents}
            smsRecords={smsRecords}
            onNavigateTab={setActiveTab}
            onSelectIncident={setSelectedIncidentModal}
            onConfirmFire={handleConfirmFire}
            onMarkFalseAlarm={handleMarkFalseAlarm}
            onOpenSendSms={() => setIsSendSmsModalOpen(true)}
            onSimulateTrigger={handleSimulateTrigger}
          />
        )}

        {activeTab === "live" && (
          <LiveStreamView
            currentNode={currentNode}
            activeIncident={pendingIncident}
            onConfirmFire={handleConfirmFire}
            onMarkFalseAlarm={handleMarkFalseAlarm}
            onToggleFlashLed={handleToggleFlashLed}
          />
        )}

        {activeTab === "detections" && (
          <PastDetectionsTable
            incidents={incidents}
            onSelectIncident={setSelectedIncidentModal}
            onToggleResolve={handleToggleResolve}
            onViewSmsForIncident={(incId) => {
              setActiveTab("sms");
            }}
          />
        )}

        {activeTab === "sms" && (
          <SmsRecordsTable
            smsRecords={smsRecords}
            onOpenSendSms={() => setIsSendSmsModalOpen(true)}
            onSelectIncidentById={(incId) => {
              const inc = incidents.find((i) => i.id === incId);
              if (inc) setSelectedIncidentModal(inc);
            }}
          />
        )}

        {activeTab === "hardware" && (
          <IotTelemetryPanel
            currentNode={currentNode}
            onToggleFlashLed={handleToggleFlashLed}
            onToggleBuzzer={handleToggleBuzzer}
            buzzerActive={buzzerActive}
            onSimulateTrigger={handleSimulateTrigger}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-4 px-4 lg:px-8 mt-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>PYROGUARD IoT Console</span>
            <span>&bull;</span>
            <span>ESP32-CAM + MQ-2 + Optical IR Flame Detection Grid</span>
          </div>
          <div>
            <span>Telemetry Pipeline: Active &bull; Zero Gradient Minimalist Theme</span>
          </div>
        </div>
      </footer>

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncidentModal}
        onClose={() => setSelectedIncidentModal(null)}
        onConfirmFire={handleConfirmFire}
        onMarkFalseAlarm={handleMarkFalseAlarm}
        onToggleResolve={handleToggleResolve}
        smsRecords={smsRecords}
      />

      {/* Send Test SMS Modal */}
      <SendTestSmsModal
        isOpen={isSendSmsModalOpen}
        onClose={() => setIsSendSmsModalOpen(false)}
        onSendSms={handleAddNewSms}
        activeIncidentId={pendingIncident?.id || "INC-2026-1042"}
      />
    </div>
  );
}
