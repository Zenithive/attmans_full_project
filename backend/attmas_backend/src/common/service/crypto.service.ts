import { createCipheriv, createDecipheriv } from 'crypto';
import * as moment from 'moment';

// Secret key for encryption/decryption (32 bytes for AES-256)
const secretKey = Buffer.from(
  'e79c284b9aafcdf8e6dca85bba5cf546d84a4fdadf894f3c882446c1c1c8c014',
  'hex',
);
// Initialization vector (IV), must be 16 bytes
const iv = Buffer.from('1234567890abcdef1234567890abcdef', 'hex');
console.log(secretKey);
console.log(iv);
export const minutesToExpireCrypto = 15;

// Encrypt function
export function encryptWithCrypto(id: string): string {
  const expirationTime = moment()
    .add(minutesToExpireCrypto, 'minutes')
    .toISOString();

  const cipher = createCipheriv('aes-256-cbc', secretKey, iv);
  const data = `${id}|${expirationTime}`;
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return IV and encrypted string
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt function
export const decryptWithCrypto = (encryptedData: string) => {
  const [ivHex, encrypted] = encryptedData.split(':');
  const decipher = createDecipheriv(
    'aes-256-cbc',
    secretKey,
    Buffer.from(ivHex, 'hex'),
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  // Split decrypted data into ID and expiration time
  const [id, expirationTime] = decrypted.split('|');

  return { id, expirationTime };
};

export const getMinutesElapsed = (expirationTime: string): number => {
  // Parse the expiration time
  const expiration = moment(expirationTime);

  // Get the current time
  const now = moment();

  // Calculate the difference in minutes
  const minutesElapsed = now.diff(expiration, 'minutes');

  return minutesElapsed;
};

// // Example usage
// const mongoId = '64f97fa38b73ae3ff1edcd4e';
// const minutesToExpire = 15;

// const encryptedData = encrypt(mongoId, minutesToExpire);
// console.log('Encrypted:', encryptedData);

// const decryptedData = decrypt(encryptedData);
// console.log('Decrypted:', decryptedData);
