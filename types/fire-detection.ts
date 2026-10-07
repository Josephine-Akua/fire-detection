export type IncidentStatus = 'CONFIRMED FIRE' | 'FALSE ALARM' | 'PENDING VERIFICATION' | 'RESOLVED';
export type IncidentSeverity = 'CRITICAL' | 'WARNING' | 'ELEVATED' | 'INFO';
export type SensorTriggerType = 'DUAL TRIGGER (FLAME + SMOKE)' | 'FLAME SENSOR' | 'GAS/SMOKE SENSOR';

export interface IncidentRecord {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeName: string;
  location: string;
  triggerType: SensorTriggerType;
  gasPpm: number;
  flameActive: boolean;
  severity: IncidentSeverity;
  status: IncidentStatus;
  confirmedBy?: string;
  confirmedAt?: string;
  snapshotUrl: string;
  notes: string;
  smsCount: number;
}

export type SmsStatus = 'DELIVERED' | 'QUEUED' | 'SENDING' | 'FAILED';

export interface SmsRecord {
  id: string;
  incidentId: string;
  recipientName: string;
  recipientPhone: string;
  recipientRole: string;
  timestamp: string;
  status: SmsStatus;
  messageText: string;
  gateway: string;
  latencyMs: number;
}

export interface IotNodeState {
  id: string;
  name: string;
  zone: string;
  ipAddress: string;
  isOnline: boolean;
  lastHeartbeat: string;
  esp32Temp: number;
  wifiRssi: number;
  cameraFps: number;
  cameraResolution: string;
  flashLedActive: boolean;
  mq2Ppm: number;
  mq2Threshold: number;
  flameSensorDetected: boolean;
  buzzerActive: boolean;
  firmwareVersion: string;
}
