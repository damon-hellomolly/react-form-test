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

export const INITIAL_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function validateContactForm(
  data: ContactFormData,
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const subject = data.subject.trim();
  const message = data.message.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(email)) {
    errors.email = "Email format is invalid.";
  }

  if (!subject) {
    errors.subject = "Subject is required.";
  } else if (subject.length < 5) {
    errors.subject = "Subject must be at least 5 characters.";
  }

  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

export interface CaptchaChallenge {
  left: number;
  right: number;
  operator: "+" | "-";
  question: string;
  answer: number;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createCaptchaChallenge(): CaptchaChallenge {
  const operator: CaptchaChallenge["operator"] = Math.random() > 0.5 ? "+" : "-";
  const left = getRandomInt(1, 20);
  const right = getRandomInt(1, 20);

  if (operator === "+") {
    return {
      left,
      right,
      operator,
      question: `${left} + ${right} = ?`,
      answer: left + right,
    };
  }

  const larger = Math.max(left, right);
  const smaller = Math.min(left, right);

  return {
    left: larger,
    right: smaller,
    operator,
    question: `${larger} - ${smaller} = ?`,
    answer: larger - smaller,
  };
}

export function validateCaptchaInput(
  captchaInput: string,
  expectedAnswer: number,
): string | null {
  const normalized = captchaInput.trim();

  if (!normalized) {
    return "CAPTCHA is required.";
  }

  if (!/^-?\d+$/.test(normalized)) {
    return "CAPTCHA must be a number.";
  }

  if (Number(normalized) !== expectedAnswer) {
    return "CAPTCHA is incorrect.";
  }

  return null;
}
