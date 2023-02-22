import * as crypto from 'crypto';


/**
 * Hashes the content using the SHA256 algorithm.
 */
export function sha256HashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}
