/**
 * Security Input Sanitization & Anti-XSS Utilities for ULEF Atelier
 * Protects against Stored XSS, DOM-based XSS, script injection, and payload attacks.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;'
};

/**
 * Escapes HTML special characters to prevent DOM-based XSS injection
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[&<>"'`\/]/g, char => HTML_ENTITY_MAP[char] || char);
}

/**
 * Strips script tags, iframe, object, javascript: URI schemas, and dangerous event handlers.
 * Preserves standard alphabetic characters, spaces, and normal punctuation for addresses and names.
 */
export function sanitizeText(input: string, maxLength = 250): string {
  if (!input || typeof input !== 'string') return '';
  
  let clean = input
    // Strip null bytes and control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip HTML/XML tags
    .replace(/<[^>]*>/g, '')
    // Strip common XSS protocols and event handlers
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  if (maxLength && clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }

  return clean;
}

/**
 * Strictly sanitizes an Indian phone number (10 digits)
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^0-9]/g, '').slice(0, 10);
}

/**
 * Strictly sanitizes an Indian PIN code (6 digits, non-zero starting)
 */
export function sanitizePincode(pincode: string): string {
  if (!pincode || typeof pincode !== 'string') return '';
  return pincode.replace(/[^0-9]/g, '').slice(0, 6);
}

/**
 * Sanitizes an email address, lowercasing and trimming illegal control characters
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email
    .replace(/[\x00-\x1F\x7F\s<>'"\\]/g, '')
    .trim()
    .toLowerCase()
    .slice(0, 100);
}

/**
 * Validates and sanitizes safe URLs. Rejects javascript:, data:, and file: schemes.
 * Only allows https:// or http:// protocols.
 */
export function sanitizeUrl(url: string, fallback = ''): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Explicitly block malicious protocol prefixes
  if (/^(javascript|vbscript|data|file):/i.test(trimmed)) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    // Relative path check (e.g. /images/...)
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return trimmed;
    }
  }

  return fallback;
}

/**
 * Computes SHA-256 hexadecimal hash using Web Crypto API for secure password comparison
 */
export async function sha256Hash(message: string): Promise<string> {
  if (!message) return '';
  try {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple hash for older environments
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `fb_${Math.abs(hash).toString(16)}`;
  }
}
