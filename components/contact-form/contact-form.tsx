"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  CaptchaChallenge,
  createCaptchaChallenge,
  INITIAL_FORM_DATA,
  AttachedFile,
  ContactFormData,
  ContactFormErrors,
  FileUploadError,
  validateContactForm,
  validateCaptchaInput,
} from "@/components/contact-form/contact-form-model";
import {
  createAttachedFiles,
  formatFileSize,
  getTotalFileSize,
  MAX_TOTAL_SIZE,
} from "@/components/contact-form/file-upload";
import { submitContactFormSimulation } from "@/components/contact-form/submit";
import {
  clearDraftFromSessionStorage,
  restoreDraftFromSessionStorage,
  saveDraftToSessionStorage,
} from "@/components/contact-form/session-storage";

export type ContactFormProps = {
  formId?: string;
  hideSubmitButton?: boolean;
  onSubmittingChange?: (isSubmitting: boolean) => void;
};

export default function ContactForm({
  formId = "contact-us-form",
  hideSubmitButton = false,
  onSubmittingChange,
}: ContactFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const attachmentsInputRef = useRef<HTMLInputElement>(null);
  const captchaInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [fileUploadError, setFileUploadError] = useState<FileUploadError>(null);
  const [captchaChallenge, setCaptchaChallenge] =
    useState<CaptchaChallenge | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);

  const totalFileSize = getTotalFileSize(attachedFiles);
  const fileSizeLimitError = `Total file size must not exceed ${formatFileSize(MAX_TOTAL_SIZE)}.`;

  useEffect(() => {
    setCaptchaChallenge(createCaptchaChallenge());
  }, []);

  // restore the draft from session storage when the component mounts
  useEffect(() => {
    const restoredDraft = restoreDraftFromSessionStorage();
    if (!restoredDraft) {
      setIsDraftHydrated(true);
      return;
    }

    setFormData(restoredDraft);
    toast.success("Draft restored.", { id: "contact-form:draft-restored" });
    setIsDraftHydrated(true);
  }, []);

  // save the draft to session storage when the form data changes
  useEffect(() => {
    if (!isDraftHydrated) {
      return;
    }

    saveDraftToSessionStorage(formData);
  }, [formData, isDraftHydrated]);

  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  function handleFieldChange<K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K],
  ) {
    setFormData((prev) => {
      const nextData = { ...prev, [key]: value };
      const nextErrors = validateContactForm(nextData);

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [key]: nextErrors[key],
      }));

      return nextData;
    });
  }

  // focus the first invalid field when the form is submitted
  function focusFirstInvalidField(
    errors: ContactFormErrors,
    nextFileUploadError: FileUploadError,
    nextCaptchaError: string | null,
  ) {
    if (errors.name) {
      nameInputRef.current?.focus();
      return;
    }
    if (errors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (errors.subject) {
      subjectInputRef.current?.focus();
      return;
    }
    if (errors.message) {
      messageInputRef.current?.focus();
      return;
    }
    if (nextFileUploadError) {
      attachmentsInputRef.current?.focus();
      return;
    }
    if (nextCaptchaError) {
      captchaInputRef.current?.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!captchaChallenge) {
      setCaptchaError("CAPTCHA is loading. Please try again.");
      return;
    }

    const errors = validateContactForm(formData);
    const nextFileUploadError =
      totalFileSize > MAX_TOTAL_SIZE ? fileSizeLimitError : null;
    const nextCaptchaError = validateCaptchaInput(
      captchaInput,
      captchaChallenge.answer,
    );

    setFormErrors(errors);
    setFileUploadError(nextFileUploadError);
    setCaptchaError(nextCaptchaError);

    if (
      Object.keys(errors).length > 0 ||
      nextFileUploadError ||
      nextCaptchaError
    ) {
      focusFirstInvalidField(errors, nextFileUploadError, nextCaptchaError);
      return;
    }

    try {
      setIsSubmitting(true);
      await submitContactFormSimulation({ formData, attachedFiles });
      toast.success("Message successfully delivered");
      // Clear session storage after successful submission
      clearDraftFromSessionStorage();

      setFormData(INITIAL_FORM_DATA);
      setFormErrors({});

      setAttachedFiles([]);
      setFileUploadError(null);

      setCaptchaChallenge(createCaptchaChallenge());
      setCaptchaInput("");
      setCaptchaError(null);
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files;
    if (!selected || selected.length === 0) {
      return;
    }

    const nextFiles = createAttachedFiles(selected);
    const nextFilesTotalSize = getTotalFileSize(nextFiles);
    const nextCombinedTotalSize = totalFileSize + nextFilesTotalSize;

    if (nextCombinedTotalSize > MAX_TOTAL_SIZE) {
      setFileUploadError(fileSizeLimitError);
      event.target.value = "";
      return;
    }

    setAttachedFiles((prev) => [...prev, ...nextFiles]);
    setFileUploadError(null);
    event.target.value = "";
  }

  function handleRemoveFile(id: string) {
    setAttachedFiles((prev) => {
      const nextAttachedFiles = prev.filter((file) => file.id !== id);
      const nextTotalSize = getTotalFileSize(nextAttachedFiles);

      if (nextTotalSize <= MAX_TOTAL_SIZE) {
        setFileUploadError(null);
      }

      return nextAttachedFiles;
    });
  }

  function handleCaptchaRefresh() {
    setCaptchaChallenge(createCaptchaChallenge());
    setCaptchaInput("");
    setCaptchaError(null);
  }

  return (
    <form
      id={formId}
      noValidate
      className="space-y-3 sm:space-y-4"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="name" className="text-sm md:pt-2">
          Name
        </label>
        <div className="min-w-0 space-y-1">
          <input
            ref={nameInputRef}
            id="name"
            name="name"
            type="text"
            required
            disabled={isSubmitting}
            aria-invalid={formErrors.name ? true : undefined}
            aria-describedby={formErrors.name ? "name-error" : undefined}
            aria-errormessage={formErrors.name ? "name-error" : undefined}
            placeholder="Enter your name"
            value={formData.name}
            onChange={(event) => handleFieldChange("name", event.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {formErrors.name ? (
            <p
              id="name-error"
              role="alert"
              aria-live="assertive"
              className="text-sm leading-5 break-words text-red-600"
            >
              {formErrors.name}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="email" className="text-sm md:pt-2">
          Email
        </label>
        <div className="min-w-0 space-y-1">
          <input
            ref={emailInputRef}
            id="email"
            name="email"
            type="email"
            required
            disabled={isSubmitting}
            aria-invalid={formErrors.email ? true : undefined}
            aria-describedby={formErrors.email ? "email-error" : undefined}
            aria-errormessage={formErrors.email ? "email-error" : undefined}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(event) => handleFieldChange("email", event.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {formErrors.email ? (
            <p
              id="email-error"
              role="alert"
              aria-live="assertive"
              className="text-sm leading-5 break-words text-red-600"
            >
              {formErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="subject" className="text-sm md:pt-2">
          Subject
        </label>
        <div className="min-w-0 space-y-1">
          <input
            ref={subjectInputRef}
            id="subject"
            name="subject"
            type="text"
            required
            disabled={isSubmitting}
            aria-invalid={formErrors.subject ? true : undefined}
            aria-describedby={formErrors.subject ? "subject-error" : undefined}
            aria-errormessage={formErrors.subject ? "subject-error" : undefined}
            placeholder="Enter a subject"
            value={formData.subject}
            onChange={(event) =>
              handleFieldChange("subject", event.target.value)
            }
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {formErrors.subject ? (
            <p
              id="subject-error"
              role="alert"
              aria-live="assertive"
              className="text-sm leading-5 break-words text-red-600"
            >
              {formErrors.subject}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="message" className="text-sm md:pt-2">
          Message
        </label>
        <div className="min-w-0 space-y-1">
          <textarea
            ref={messageInputRef}
            id="message"
            name="message"
            rows={3}
            required
            disabled={isSubmitting}
            aria-invalid={formErrors.message ? true : undefined}
            aria-describedby={formErrors.message ? "message-error" : undefined}
            aria-errormessage={formErrors.message ? "message-error" : undefined}
            placeholder="Enter your message"
            value={formData.message}
            onChange={(event) =>
              handleFieldChange("message", event.target.value)
            }
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {formErrors.message ? (
            <p
              id="message-error"
              role="alert"
              aria-live="assertive"
              className="text-sm leading-5 break-words text-red-600"
            >
              {formErrors.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="attachments" className="text-sm md:pt-2">
          Attachments
        </label>
        <div className="min-w-0 space-y-2">
          <input
            ref={attachmentsInputRef}
            id="attachments"
            name="attachments"
            type="file"
            multiple
            disabled={isSubmitting}
            aria-invalid={fileUploadError ? true : undefined}
            aria-label="Attach files"
            aria-describedby={
              fileUploadError
                ? "attachments-help attachments-error"
                : "attachments-help"
            }
            aria-errormessage={
              fileUploadError ? "attachments-error" : undefined
            }
            onChange={handleFilesChange}
            className="w-min rounded border px-4 py-2 text-sm text-transparent hover:cursor-pointer file:text-sm file:font-medium file:text-gray-700 hover:bg-gray-200"
          />
          <p id="attachments-help" className="text-sm text-gray-600">
            Choose one or more files. Combined size limit is{" "}
            {formatFileSize(MAX_TOTAL_SIZE)}.
          </p>
          <p className="text-sm text-gray-600">
            Total size: {formatFileSize(totalFileSize)} /{" "}
            {formatFileSize(MAX_TOTAL_SIZE)}
          </p>

          {fileUploadError ? (
            <p
              id="attachments-error"
              role="alert"
              aria-live="assertive"
              className="text-sm leading-5 break-words text-red-600"
            >
              {fileUploadError}
            </p>
          ) : null}

          {attachedFiles.length > 0 ? (
            <ul className="space-y-1">
              {attachedFiles.map((attachedFile) => (
                <li
                  key={attachedFile.id}
                  className="flex flex-col gap-2 rounded border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="min-w-0 break-all text-sm">
                    {attachedFile.name} ({formatFileSize(attachedFile.size)})
                  </span>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleRemoveFile(attachedFile.id)}
                    aria-label={`Remove ${attachedFile.name}`}
                    className="self-start rounded border px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="captcha" className="text-sm md:pt-2">
          CAPTCHA
        </label>
        <div className="min-w-0 space-y-2">
          <div className="flex items-start gap-2">
            <input
              ref={captchaInputRef}
              id="captcha"
              name="captcha"
              type="text"
              inputMode="numeric"
              disabled={isSubmitting}
              aria-invalid={captchaError ? true : undefined}
              aria-describedby={captchaError ? "captcha-error" : undefined}
              aria-errormessage={captchaError ? "captcha-error" : undefined}
              placeholder="Enter answer"
              value={captchaInput}
              onChange={(event) => {
                setCaptchaInput(event.target.value);
                if (captchaError) {
                  setCaptchaError(null);
                }
              }}
              className="min-w-0 flex-1 rounded border px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCaptchaRefresh}
              className="shrink-0 rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 hover:bg-gray-200 hover:cursor-pointer"
            >
              Solve:{" "}
              {captchaChallenge ? captchaChallenge.question : "Loading..."}
            </button>
          </div>
          {captchaError ? (
            <p
              id="captcha-error"
              role="alert"
              aria-live="assertive"
              className="text-sm leading-5 break-words text-red-600"
            >
              {captchaError}
            </p>
          ) : null}
        </div>
      </div>

      {!hideSubmitButton ? (
        <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)]">
          <div />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
