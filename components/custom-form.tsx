"use client";

import * as React from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Paperclip, Send, X, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ---------- Constants ----------

const DRAFT_KEY = "contact-form:draft";
const RESULT_KEY = "contact-form:last-result";
const MAX_TOTAL_BYTES = 25 * 1024 * 1024; // 25MB

// ---------- Schema ----------

const fileMetaSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
});

const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    subject: z
      .string()
      .trim()
      .min(1, "Subject is required")
      .min(5, "Subject must be at least 5 characters"),
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .min(10, "Message must be at least 10 characters"),
    files: z
      .array(z.instanceof(File))
      .refine(
        (files) => files.reduce((acc, f) => acc + f.size, 0) <= MAX_TOTAL_BYTES,
        { message: `Total file size must not exceed ${formatBytes(MAX_TOTAL_BYTES)}` },
      ),
    captcha: z.string().trim().min(1, "Please solve the challenge"),
  })
  .superRefine((data, ctx) => {
    // Captcha correctness is checked in the submit handler because the
    // expected value lives outside the schema. Nothing extra to do here.
    void data;
    void ctx;
  });

type ContactFormValues = z.infer<typeof contactSchema>;

// What we persist as a draft (Files can't be serialized).
type DraftValues = Pick<ContactFormValues, "name" | "email" | "subject" | "message">;

type StoredFileMeta = z.infer<typeof fileMetaSchema>;

export interface SubmittedResult {
  id: string;
  submittedAt: string;
  values: DraftValues;
  files: StoredFileMeta[];
}

// ---------- Helpers ----------

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function generateCaptcha(): { a: number; b: number } {
  return {
    a: Math.floor(Math.random() * 9) + 1,
    b: Math.floor(Math.random() * 9) + 1,
  };
}

function fakeSubmit(payload: {
  values: DraftValues;
  files: StoredFileMeta[];
}): Promise<SubmittedResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error("Network error, please try again"));
        return;
      }
      resolve({
        id: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
        values: payload.values,
        files: payload.files,
      });
    }, 2000);
  });
}

const DEFAULT_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  files: [],
  captcha: "",
};

// ---------- Component ----------

export default function CustomerForm() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Send className="h-5 w-5" />
          Contact Us Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact us</DialogTitle>
          <DialogDescription>
            Send us a message and we&apos;ll get back to you shortly. Your draft
            is saved automatically.
          </DialogDescription>
        </DialogHeader>
        <ContactFormBody onSubmitted={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ContactFormBody({ onSubmitted }: { onSubmitted: () => void }) {
  const [captcha, setCaptcha] = React.useState(() => generateCaptcha());
  const [hydrated, setHydrated] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  // Restore draft from session storage on mount.
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DraftValues>;
        reset({
          ...DEFAULT_VALUES,
          name: parsed.name ?? "",
          email: parsed.email ?? "",
          subject: parsed.subject ?? "",
          message: parsed.message ?? "",
        });
      }
    } catch {
      // Ignore corrupt drafts.
    } finally {
      setHydrated(true);
    }
  }, [reset]);

  // Auto-save draft (text fields only) as the user types.
  const watchedDraftFields = watch(["name", "email", "subject", "message"]);
  React.useEffect(() => {
    if (!hydrated) return;
    const [name, email, subject, message] = watchedDraftFields;
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ name, email, subject, message } satisfies DraftValues),
      );
    } catch {
      // Storage may be unavailable; ignore.
    }
  }, [watchedDraftFields, hydrated]);

  const files = watch("files");
  const messageLen = (watch("message") ?? "").trim().length;
  const totalSize = React.useMemo(
    () => (files ?? []).reduce((acc, f) => acc + f.size, 0),
    [files],
  );

  function handleFilesAdded(list: FileList | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    const key = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
    const existing = new Set((getValues("files") ?? []).map(key));
    const merged = [
      ...(getValues("files") ?? []),
      ...incoming.filter((f) => !existing.has(key(f))),
    ];
    setValue("files", merged, { shouldValidate: true, shouldDirty: true });
  }

  function removeFile(index: number) {
    const next = (getValues("files") ?? []).filter((_, i) => i !== index);
    setValue("files", next, { shouldValidate: true, shouldDirty: true });
  }

  function regenerateCaptcha() {
    setCaptcha(generateCaptcha());
    setValue("captcha", "", { shouldValidate: false });
  }

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    const expected = captcha.a + captcha.b;
    if (Number(data.captcha) !== expected) {
      setError("captcha", {
        type: "manual",
        message: "Incorrect answer, try again",
      });
      return;
    }

    try {
      const fileMeta: StoredFileMeta[] = data.files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }));
      const draft: DraftValues = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      };
      const result = await fakeSubmit({ values: draft, files: fileMeta });

      sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
      sessionStorage.removeItem(DRAFT_KEY);

      toast.success("Message successfully delivered", {
        description: `Reference ID: ${result.id.slice(0, 8)}`,
      });

      reset(DEFAULT_VALUES);
      regenerateCaptcha();
      onSubmitted();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Submission failed";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <Field id="field-name" label="Name" required error={errors.name?.message}>
        <Input
          id="field-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "field-name-error" : undefined}
          disabled={isSubmitting}
          {...register("name")}
        />
      </Field>

      {/* Email */}
      <Field
        id="field-email"
        label="Email"
        required
        error={errors.email?.message}
      >
        <Input
          id="field-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "field-email-error" : undefined}
          disabled={isSubmitting}
          {...register("email")}
        />
      </Field>

      {/* Subject */}
      <Field
        id="field-subject"
        label="Subject"
        required
        error={errors.subject?.message}
      >
        <Input
          id="field-subject"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "field-subject-error" : undefined}
          disabled={isSubmitting}
          {...register("subject")}
        />
      </Field>

      {/* Message */}
      <Field
        id="field-message"
        label="Message"
        required
        error={errors.message?.message}
        hint={`${messageLen} / 10 min`}
      >
        <Textarea
          id="field-message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "field-message-error" : undefined}
          disabled={isSubmitting}
          {...register("message")}
        />
      </Field>

      {/* Files — Controller because <input type="file"> isn't a controlled
          value in the RHF sense; we mirror a File[] into form state. */}
      <Controller
        control={control}
        name="files"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="field-files">Attachments</Label>
              <span
                className={cn(
                  "text-xs",
                  totalSize > MAX_TOTAL_BYTES
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {formatBytes(totalSize)} / {formatBytes(MAX_TOTAL_BYTES)}
              </span>
            </div>
            <input
              ref={fileInputRef}
              id="field-files"
              type="file"
              multiple
              className="sr-only"
              onChange={(e) => {
                handleFilesAdded(e.target.files);
                e.target.value = "";
              }}
              aria-describedby={
                fieldState.error ? "field-files-error" : undefined
              }
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <Paperclip className="h-4 w-4" />
              Add files
            </Button>

            {field.value && field.value.length > 0 && (
              <ul className="space-y-1.5" aria-label="Selected files">
                {field.value.map((f, i) => (
                  <li
                    key={`${f.name}-${f.size}-${f.lastModified}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {f.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(f.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeFile(i)}
                      aria-label={`Remove ${f.name}`}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {fieldState.error && (
              <p
                id="field-files-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* CAPTCHA */}
      <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
        <Label htmlFor="field-captcha">Verify you&apos;re human</Label>
        <div className="flex items-center gap-2">
          <div
            aria-live="polite"
            className="rounded-md bg-background px-3 py-2 font-mono text-sm tabular-nums select-none"
          >
            {captcha.a} + {captcha.b} = ?
          </div>
          <Input
            id="field-captcha"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-24"
            aria-invalid={!!errors.captcha}
            aria-describedby={
              errors.captcha ? "field-captcha-error" : undefined
            }
            disabled={isSubmitting}
            {...register("captcha")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={regenerateCaptcha}
            aria-label="Generate new challenge"
            disabled={isSubmitting}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        {errors.captcha && (
          <p
            id="field-captcha-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.captcha.message}
          </p>
        )}
      </div>

      <DialogFooter className="gap-2 pt-2">
        <DialogClose asChild>
          <Button type="button" variant="ghost" disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ---------- Small subcomponents ----------

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
          )}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
