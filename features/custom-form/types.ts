export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export type FileUploadError = string | null;
