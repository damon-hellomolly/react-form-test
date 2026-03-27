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

export interface SubmittedAttachment {
  name: string;
  size: number;
  type: string;
}

// Store the submission result(mock data) in session storage
export interface SubmissionResult {
  id: string;
  submittedAt: string;
  formData: ContactFormData;
  attachments: SubmittedAttachment[];
  totalAttachmentSize: number;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export type FileUploadError = string | null;
