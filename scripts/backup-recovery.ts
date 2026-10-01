/**
 * Disaster Recovery & Backup Restoration Script
 * Usage: npx tsx scripts/backup-recovery.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUPS_DIR = path.resolve(__dirname, '../backups');
const INQUIRIES_FILE = path.join(BACKUPS_DIR, 'inquiries_audit.jsonl');
const WAITLIST_FILE = path.join(BACKUPS_DIR, 'waitlist_audit.jsonl');

export function runDisasterRecoveryAudit() {
  console.log('==================================================');
  console.log('NEWTA TECH // DISASTER RECOVERY & BACKUP AUDIT');
  console.log('==================================================');

  // 1. Audit Inquiries
  console.log('\n--- 1. INQUIRIES AUDIT ---');
  if (fs.existsSync(INQUIRIES_FILE)) {
    const stat = fs.statSync(INQUIRIES_FILE);
    const permissions = (stat.mode & 0o777).toString(8);
    console.log(`[File] Path: ${INQUIRIES_FILE}`);
    console.log(`[File] Permissions: 0${permissions} (Least-privilege: 0600)`);
    console.log(`[File] Size: ${stat.size} bytes`);

    const lines = fs.readFileSync(INQUIRIES_FILE, 'utf-8').trim().split('\n').filter(Boolean);
    console.log(`[Data] Total inquiries: ${lines.length}`);
    lines.slice(-3).forEach((line, idx) => {
      try {
        const r = JSON.parse(line);
        console.log(`  - #${idx + 1}: [${r.id}] ${r.name} (${r.email}) -> Status: ${r.deliveryStatus}`);
      } catch {}
    });
  } else {
    console.log('No inquiries backup file found yet.');
  }

  // 2. Audit Waitlists
  console.log('\n--- 2. WAITLIST REGISTRATIONS AUDIT ---');
  if (fs.existsSync(WAITLIST_FILE)) {
    const stat = fs.statSync(WAITLIST_FILE);
    const permissions = (stat.mode & 0o777).toString(8);
    console.log(`[File] Path: ${WAITLIST_FILE}`);
    console.log(`[File] Permissions: 0${permissions} (Least-privilege: 0600)`);
    console.log(`[File] Size: ${stat.size} bytes`);

    const lines = fs.readFileSync(WAITLIST_FILE, 'utf-8').trim().split('\n').filter(Boolean);
    console.log(`[Data] Total waitlist signups: ${lines.length}`);
    lines.slice(-3).forEach((line, idx) => {
      try {
        const r = JSON.parse(line);
        console.log(`  - #${idx + 1}: [${r.id}] ${r.email} for "${r.productName}" (${r.role}) -> Status: ${r.deliveryStatus}`);
      } catch {}
    });
  } else {
    console.log('No waitlist backup file found yet.');
  }

  console.log('\n--------------------------------------------------');
  console.log('RECOVERY PROCEDURE:');
  console.log('1. Export backups: cat backups/*.jsonl');
  console.log('2. Retrieve via API: curl -H "x-admin-key: $ADMIN_API_KEY" /api/admin/backups or /api/admin/waitlist');
  console.log('==================================================');
}

runDisasterRecoveryAudit();
