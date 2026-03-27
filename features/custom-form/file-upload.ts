import { AttachedFile } from "@/features/custom-form/types";

export const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

// format the file size
export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
}

// get the total file size
export function getTotalFileSize(files: AttachedFile[]): number {
  return files.reduce((sum, current) => sum + current.size, 0);
}

export function createAttachedFiles(files: FileList | File[]): AttachedFile[] {
  return Array.from(files).map((file) => ({
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
  }));
}
