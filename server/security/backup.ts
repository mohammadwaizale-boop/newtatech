import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { maskEmail } from './logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUPS_DIR = path.resolve(__dirname, '../../backups');
const BACKUP_FILE = path.join(BACKUPS_DIR, 'inquiries_audit.jsonl');
const WAITLIST_FILE = path.join(BACKUPS_DIR, 'waitlist_audit.jsonl');

export interface WaitlistBackupRecord {
  id: string;
  timestamp: string;
  email: string;
  role: string;
  productId: string;
  productName: string;
  deliveryStatus: 'delivered' | 'failed' | 'simulated';
  teamMessageId?: string;
  userMessageId?: string;
  ipMasked?: string;
}

export interface InquiryBackupRecord {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budgetRange: string;
  descriptionLength: number;
  descriptionSnippet: string;
  deliveryStatus: 'delivered' | 'failed' | 'simulated';
  messageId?: string;
  error?: string;
  ipMasked?: string;
}

/**
 * Initializes backup directory with strict least-privilege permissions (0700)
 */
export function ensureBackupDirectory(): void {
  try {
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true, mode: 0o700 });
    }
  } catch (err) {
    console.error('[Backup Engine] Failed to initialize backup directory:', err);
  }
}

/**
 * Persists an inquiry audit record to the secure append-only log
 */
export function recordInquiryBackup(record: Omit<InquiryBackupRecord, 'id' | 'timestamp'>): InquiryBackupRecord {
  ensureBackupDirectory();

  const id = `inq_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();

  const fullRecord: InquiryBackupRecord = {
    id,
    timestamp,
    ...record
  };

  try {
    const line = JSON.stringify(fullRecord) + '\n';
    fs.appendFileSync(BACKUP_FILE, line, { encoding: 'utf-8', mode: 0o600 });
  } catch (err) {
    console.error('[Backup Engine] Failed to write inquiry backup record:', err);
  }

  return fullRecord;
}

/**
 * Recovery utility: Reads stored inquiries for recovery
 */
export function readBackupRecords(limit = 100): InquiryBackupRecord[] {
  try {
    if (!fs.existsSync(BACKUP_FILE)) {
      return [];
    }
    const content = fs.readFileSync(BACKUP_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    const records: InquiryBackupRecord[] = [];

    for (const line of lines.slice(-limit)) {
      try {
        records.push(JSON.parse(line));
      } catch {
        // Skip malformed lines
      }
    }

    return records;
  } catch (err) {
    console.error('[Backup Engine] Error reading backup records:', err);
    return [];
  }
}

/**
 * Persists a waitlist registration to the secure audit log
 */
export function recordWaitlistBackup(record: Omit<WaitlistBackupRecord, 'id' | 'timestamp'>): WaitlistBackupRecord {
  ensureBackupDirectory();

  const id = `wl_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();

  const fullRecord: WaitlistBackupRecord = {
    id,
    timestamp,
    ...record,
  };

  try {
    const line = JSON.stringify(fullRecord) + '\n';
    fs.appendFileSync(WAITLIST_FILE, line, { encoding: 'utf-8', mode: 0o600 });
  } catch (err) {
    console.error('[Backup Engine] Failed to write waitlist backup record:', err);
  }

  return fullRecord;
}

/**
 * Reads stored waitlist records
 */
export function readWaitlistRecords(limit = 100): WaitlistBackupRecord[] {
  try {
    if (!fs.existsSync(WAITLIST_FILE)) {
      return [];
    }
    const content = fs.readFileSync(WAITLIST_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    const records: WaitlistBackupRecord[] = [];

    for (const line of lines.slice(-limit)) {
      try {
        records.push(JSON.parse(line));
      } catch {
        // Skip malformed lines
      }
    }

    return records;
  } catch (err) {
    console.error('[Backup Engine] Error reading waitlist records:', err);
    return [];
  }
}

