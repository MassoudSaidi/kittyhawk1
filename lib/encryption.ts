// lib/encryption.ts
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.BSUP_ENCRYPTION_KEY!, 'hex'); // Must be 32 bytes

export function encrypt(text: string) {
  const iv = crypto.randomBytes(12); // 96-bit nonce
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encryptedToken: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

export function decrypt({
  encryptedToken,
  iv,
  tag,
}: {
  encryptedToken: string;
  iv: string;
  tag: string;
}) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedToken, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
