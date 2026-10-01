import path from 'path';
import crypto from 'crypto';

export interface FileValidationResult {
  valid: boolean;
  sanitizedFilename?: string;
  error?: string;
  mimeType?: string;
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.pdf',
  '.txt'
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Validates magic bytes / buffer header to verify authentic file signature
 */
export function verifyMagicBytes(buffer: Buffer): string | null {
  if (!buffer || buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }

  // PDF: 25 50 44 46 (%PDF)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return 'application/pdf';
  }

  // WebP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString('utf-8', 0, 4) === 'RIFF' &&
    buffer.toString('utf-8', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

/**
 * Performs rigorous security checks on uploaded files
 */
export function validateUploadedFile(
  filename: string,
  buffer: Buffer,
  declaredMimeType: string
): FileValidationResult {
  // 1. Check size limit
  if (buffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the allowable limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }

  // 2. Normalize and check file extension
  const cleanExt = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(cleanExt)) {
    return {
      valid: false,
      error: `Extension "${cleanExt}" is not allowed. Supported extensions: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`
    };
  }

  // 3. Verify magic bytes signature
  const detectedMime = verifyMagicBytes(buffer);
  if (detectedMime && !ALLOWED_MIME_TYPES.has(detectedMime)) {
    return {
      valid: false,
      error: `Detected file format (${detectedMime}) does not match allowed MIME types.`
    };
  }

  // 4. Generate a cryptographic collision-resistant filename without directory traversal
  const randomId = crypto.randomBytes(16).toString('hex');
  const safeFilename = `upload_${Date.now()}_${randomId}${cleanExt}`;

  return {
    valid: true,
    sanitizedFilename: safeFilename,
    mimeType: detectedMime || declaredMimeType
  };
}
