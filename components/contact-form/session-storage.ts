import { ContactFormData } from "@/components/contact-form/contact-form-model";

const DRAFT_SESSION_KEY = "contact-form:draft";

export function restoreDraftFromSessionStorage(): ContactFormData | null {
  const savedDraftRaw = sessionStorage.getItem(DRAFT_SESSION_KEY);
  if (!savedDraftRaw) {
    return null;
  }

  try {
    const parsed = JSON.parse(savedDraftRaw) as Partial<ContactFormData>;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      subject: typeof parsed.subject === "string" ? parsed.subject : "",
      message: typeof parsed.message === "string" ? parsed.message : "",
    };
  } catch {
    sessionStorage.removeItem(DRAFT_SESSION_KEY);
    return null;
  }
}

export function saveDraftToSessionStorage(formData: ContactFormData) {
  // if the draft is empty, remove it from session storage
  const isDraftEmpty =
    formData.name.trim() === "" &&
    formData.email.trim() === "" &&
    formData.subject.trim() === "" &&
    formData.message.trim() === "";
  if (isDraftEmpty) {
    sessionStorage.removeItem(DRAFT_SESSION_KEY);
    return;
  }

  sessionStorage.setItem(DRAFT_SESSION_KEY, JSON.stringify(formData));
}

export function clearDraftFromSessionStorage() {
  sessionStorage.removeItem(DRAFT_SESSION_KEY);
}
