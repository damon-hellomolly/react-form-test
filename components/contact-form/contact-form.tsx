"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
};

export default function ContactForm({
  formId = "contact-us-form",
  hideSubmitButton = false,
}: ContactFormProps) {
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
    <form id={formId} noValidate className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="name" className="text-sm md:pt-2">
          Name
        </label>
        <div className="space-y-1">
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter your name"
            value={formData.name}
            onChange={(event) => handleFieldChange("name", event.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          {formErrors.name ? (
            <p className="text-sm text-red-600">{formErrors.name}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="email" className="text-sm md:pt-2">
          Email
        </label>
        <div className="space-y-1">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={(event) => handleFieldChange("email", event.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          {formErrors.email ? (
            <p className="text-sm text-red-600">{formErrors.email}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="subject" className="text-sm md:pt-2">
          Subject
        </label>
        <div className="space-y-1">
          <input
            id="subject"
            name="subject"
            type="text"
            required
            placeholder="Enter a subject"
            value={formData.subject}
            onChange={(event) => handleFieldChange("subject", event.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          {formErrors.subject ? (
            <p className="text-sm text-red-600">{formErrors.subject}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="message" className="text-sm md:pt-2">
          Message
        </label>
        <div className="space-y-1">
          <textarea
            id="message"
            name="message"
            rows={3}
            required
            placeholder="Enter your message"
            value={formData.message}
            onChange={(event) => handleFieldChange("message", event.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          {formErrors.message ? (
            <p className="text-sm text-red-600">{formErrors.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="attachments" className="text-sm md:pt-2">
          Attachments
        </label>
        <div className="space-y-2">
          <input
            id="attachments"
            name="attachments"
            type="file"
            multiple
            onChange={handleFilesChange}
            className="w-full rounded border px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
          />

          <p className="text-sm text-gray-600">
            Total size: {formatFileSize(totalFileSize)} /{" "}
            {formatFileSize(MAX_TOTAL_SIZE)}
          </p>

          {fileUploadError ? (
            <p className="text-sm text-red-600">{fileUploadError}</p>
          ) : null}

          {attachedFiles.length === 0 ? (
            <p className="text-sm text-gray-600">No files selected.</p>
          ) : (
            <ul className="space-y-1">
              {attachedFiles.map((attachedFile) => (
                <li
                  key={attachedFile.id}
                  className="flex items-center justify-between rounded border px-3 py-2"
                >
                  <span>
                    {attachedFile.name} ({formatFileSize(attachedFile.size)})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(attachedFile.id)}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
        <label htmlFor="captcha" className="text-sm md:pt-2">
          CAPTCHA
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="rounded border px-3 py-2 text-sm">
              Solve: {captchaChallenge ? captchaChallenge.question : "Loading..."}
            </p>
            <button
              type="button"
              onClick={handleCaptchaRefresh}
              className="rounded border px-2 py-1 text-sm"
            >
              Refresh
            </button>
          </div>
          <input
            id="captcha"
            name="captcha"
            type="text"
            inputMode="numeric"
            placeholder="Enter answer"
            value={captchaInput}
            onChange={(event) => {
              setCaptchaInput(event.target.value);
              if (captchaError) {
                setCaptchaError(null);
              }
            }}
            className="w-full rounded border px-3 py-2"
          />
          {captchaError ? (
            <p className="text-sm text-red-600">{captchaError}</p>
          ) : null}
        </div>
      </div>

      {!hideSubmitButton ? (
        <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)]">
          <div />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-fit rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
