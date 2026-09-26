export function validateSerialNumber(serialNumber: string): boolean {
  return serialNumber.trim().length >= 3;
}

export function validateCapacity(capacity: string): boolean {
  return capacity.trim().length > 0 && /\d/.test(capacity);
}
