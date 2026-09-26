export function validateProvisionalId(tempId: string): boolean {
  return /^TEMP-[A-Z0-9-]+$/i.test(tempId.trim());
}

export function validateLegacyEvidence(docs: string[]): boolean {
  return docs.length > 0;
}
