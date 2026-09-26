export function validateStampHash(hash: string): boolean {
  return /^[a-f0-9]{32,64}$/i.test(hash.trim());
}

export function validatePhotoEvidence(photos: string[]): boolean {
  return photos.length >= 1;
}
