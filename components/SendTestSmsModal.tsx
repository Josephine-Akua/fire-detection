"use client";

import React, { useState } from "react";
import { X, Send, Radio, MessageSquare, User, Phone, CheckCircle2 } from "lucide-react";
import { SmsRecord } from "@/types/fire-detection";

interface SendTestSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSms: (newSms: SmsRecord) => void;
  activeIncidentId?: string;
}

const presetRecipients = [
  { name: "Captain Mark Davis", phone: "+1 (555) 019-2834", role: "Fire Department Liaison" },
  { name: "Josephine Akua", phone: "+1 (555) 018-4721", role: "Facility Lead Engineer" },
  { name: "Building Security Desk", phone: "+1 (555) 014-9988", role: "On-site Security" },
  { name: "Emergency Services 911", phone: "+1 (555) 011-9911", role: "Emergency Dispatch" },
];

export default function SendTestSmsModal({
  isOpen,
  onClose,
  onSendSms,
  activeIncidentId = "INC-2026-1042",
}: SendTestSmsModalProps) {
  const [selectedRecipient, setSelectedRecipient] = useState(presetRecipients[0]);
  const [customPhone, setCustomPhone] = useState("");
  const [customName, setCustomName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [gateway, setGateway] = useState("SIM800L GSM (Cellular Quad-Band)");
  const [messageText, setMessageText] = useState(
    `[FIRE ALERT TEST] PyroGuard ESP32-CAM notification broadcast for ${activeIncidentId}. Check visual stream: https://pyrowatch.local/verify`
  );
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      const recipientName = isCustom ? (customName || "Operator Contact") : selectedRecipient.name;
      const recipientPhone = isCustom ? (customPhone || "+1 (555) 000-1234") : selectedRecipient.phone;
      const recipientRole = isCustom ? "Custom Contact" : selectedRecipient.role;

      const newRecord: SmsRecord = {
        id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
        incidentId: activeIncidentId,
        recipientName,
        recipientPhone,
        recipientRole,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        status: "DELIVERED",
        messageText,
        gateway,
        latencyMs: Math.floor(650 + Math.random() * 800),
      };

      onSendSms(newRecord);
      setIsSending(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="border-b border-zinc-800 px-5 py-4 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Send className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono">
                Dispatch Test / Emergency SMS
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                SIM800L GSM Gateway &bull; Reference {activeIncidentId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Recipient Selection */}
          <div>
            <label className="text-zinc-400 block mb-1.5 uppercase tracking-wider text-[11px]">
              Select Recipient
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setIsCustom(false)}
                className={`p-2 rounded border text-left transition-colors ${
                  !isCustom
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Preset Contacts ({presetRecipients.length})
              </button>
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`p-2 rounded border text-left transition-colors ${
                  isCustom
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Custom Contact Number
              </button>
            </div>

            {!isCustom ? (
              <select
                value={selectedRecipient.name}
                onChange={(e) => {
                  const found = presetRecipients.find((r) => r.name === e.target.value);
                  if (found) setSelectedRecipient(found);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 focus:outline-none"
              >
                {presetRecipients.map((rec) => (
                  <option key={rec.name} value={rec.name}>
                    {rec.name} — {rec.phone} ({rec.role})
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Recipient Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Gateway */}
          <div>
            <label className="text-zinc-400 block mb-1.5 uppercase tracking-wider text-[11px]">
              Cellular / SMS Gateway
            </label>
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 focus:outline-none"
            >
              <option value="SIM800L GSM (Cellular Quad-Band)">
                SIM800L GSM Module (Direct Hardware Serial UART)
              </option>
              <option value="Twilio Cloud SMS API (Backup Route)">
                Twilio Cloud SMS API (Secondary Gateway)
              </option>
            </select>
          </div>

          {/* Message Payload */}
          <div>
            <label className="text-zinc-400 block mb-1.5 uppercase tracking-wider text-[11px]">
              SMS Text Payload
            </label>
            <textarea
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none font-mono text-xs"
            />
            <span className="text-[10px] text-zinc-500 block mt-1">
              Length: {messageText.length} chars (1 SMS Segment)
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-5 py-3.5 bg-zinc-900/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-mono border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-mono border border-emerald-700 bg-emerald-950 text-emerald-200 hover:bg-emerald-900 font-semibold transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <span>Transmitting...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
