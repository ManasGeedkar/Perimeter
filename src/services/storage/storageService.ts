/**
 * PERIMETER OBJECT STORAGE SERVICE (MinIO / S3 Boundary)
 * Planned for Phase 12 (Evidence Capsule Subsystem)
 */

export const storageService = {
  async uploadFile(_file: File, _folder: string = 'evidence'): Promise<string> {
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80';
  },

  async getFileUrl(fileKey: string): Promise<string> {
    return fileKey;
  },
};
