import CryptoJS from 'crypto-js';

function isJSON(str?: string | null): boolean {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function getLocalStorage<T = any>(w: Window, key: string, isArray?: boolean) {
  const encryptedKeys = JSON.parse(w.localStorage.getItem('encryptedKeys') ?? '[]') as string[];
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_AES_KEY!;
  if (encryptedKeys.includes(key)) {
    const encryptedData = w.localStorage.getItem(key);
    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, privateKey)?.toString(CryptoJS.enc.Utf8);
      return isJSON(decryptedData)
        ? (JSON.parse(decryptedData ? decryptedData : isArray ? '[]' : 'null') as T | null)
        : (decryptedData as T | null);
    } else {
      return JSON.parse(encryptedData ? encryptedData : isArray ? '[]' : 'null') as T | null;
    }
  } else {
    const item = w.localStorage.getItem(key);
    if (isJSON(item)) return JSON.parse(item ? item : isArray ? '[]' : 'null') as T | null;
    else return item as T | null;
  }
}

export function setLocalStorage(w: Window, key: string, value: any) {
  const encryptStorage = process.env.NEXT_PUBLIC_ENCRYPT_STORAGE === 'true';
  const encryptedKeys = JSON.parse(w.localStorage.getItem('encryptedKeys') ?? '[]') as string[];
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_AES_KEY!;

  if (encryptStorage) {
    const encryptedData = CryptoJS.AES.encrypt(
      typeof value === 'string' ? value : JSON.stringify(value),
      privateKey
    ).toString();
    w.localStorage.setItem(key, encryptedData);
    if (!encryptedKeys.includes(key)) {
      encryptedKeys.push(key);
      w.localStorage.setItem('encryptedKeys', JSON.stringify(encryptedKeys));
    }
  } else {
    if (encryptedKeys.includes(key)) {
      const newKeys = [...encryptedKeys];
      newKeys.splice(encryptedKeys.indexOf(key), 1);
      w.localStorage.setItem('encryptedKeys', JSON.stringify(newKeys));
    }
    w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
}
