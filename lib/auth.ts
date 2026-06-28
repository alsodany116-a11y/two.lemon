const JWT_SECRET = process.env.JWT_SECRET || 'romantic-memories-secret-jwt-key-2026';

export interface AdminSession {
  authenticated: boolean;
  username: string;
  exp?: number;
}

// Helper to convert ArrayBuffer to Base64URL
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Helper to convert Base64URL to Uint8Array
function base64UrlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  const binary = atob(padded);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}

export async function signToken(payload: any): Promise<string> {
  const encoder = new TextEncoder();
  
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  // Set expiration to 7 days (7 * 24 * 60 * 60 seconds)
  const fullPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
  };
  const encodedPayload = btoa(JSON.stringify(fullPayload))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  const dataToSign = encoder.encode(`${encodedHeader}.${encodedPayload}`);
  const secretKeyData = encoder.encode(JWT_SECRET);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    secretKeyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
  const encodedSignature = bufferToBase64Url(signatureBuffer);
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, payload, signature] = parts;
    const encoder = new TextEncoder();
    const dataToVerify = encoder.encode(`${header}.${payload}`);
    const secretKeyData = encoder.encode(JWT_SECRET);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      secretKeyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signatureBuffer = base64UrlToBuffer(signature);
    const isValid = await crypto.subtle.verify('HMAC', cryptoKey, signatureBuffer as any, dataToVerify as any);
    
    if (!isValid) return null;
    
    // Decode and parse payload
    const decodedPayloadStr = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const decodedPayload = JSON.parse(decodedPayloadStr) as AdminSession;
    
    // Verify expiration date
    if (decodedPayload.exp && Math.floor(Date.now() / 1000) > decodedPayload.exp) {
      console.log('JWT expired');
      return null;
    }
    
    return decodedPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}
