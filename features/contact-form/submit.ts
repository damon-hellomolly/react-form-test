import {
  AttachedFile,
  ContactFormData,
  SubmissionResult,
} from "@/features/contact-form/types";

const SUBMISSION_DELAY_MS = 2000;
const LAST_SUBMISSION_SESSION_KEY = "contact-form:last-submission";

interface SubmitContactFormPayload {
  formData: ContactFormData;
  attachedFiles: AttachedFile[];
}

function createSubmissionResult(
  payload: SubmitContactFormPayload,
): SubmissionResult {
  return {
    id: `submission-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    formData: payload.formData,
    attachments: payload.attachedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
    totalAttachmentSize: payload.attachedFiles.reduce(
      (sum, file) => sum + file.size,
      0,
    ),
  };
}

export async function submitContactFormSimulation(
  payload: SubmitContactFormPayload,
): Promise<SubmissionResult> {
  // Simulate a fetch API call with a 2-second delay
  await new Promise<void>((resolve) => setTimeout(resolve, SUBMISSION_DELAY_MS));

  const result = createSubmissionResult(payload);
  sessionStorage.setItem(LAST_SUBMISSION_SESSION_KEY, JSON.stringify(result));

  return result;
}

export { LAST_SUBMISSION_SESSION_KEY };
