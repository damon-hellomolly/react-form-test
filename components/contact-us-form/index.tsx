import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FieldGroup, Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import React from "react";
import { Loader, Upload, X } from "lucide-react";
import { toast } from "sonner";

function useSessionStorage() {
  const _KEY = "contactFormData";
  return [
    JSON.parse(sessionStorage.getItem(_KEY) || "{}"),
    (data: string) => sessionStorage.setItem(_KEY, data),
    () => sessionStorage.removeItem(_KEY),
  ] as const;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  attachment: z.array(z.file()).refine((files) => {
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    return totalSize <= 25 * 1024 * 1024; // 25MB limit
  }, "Total attachment size must be less than 25MB."),
});

export function ContactUsForm({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionStorageData, setSessionStorageData, clearSessionStorage] =
    useSessionStorage();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      attachment: [],
      ...sessionStorageData,
    },
  });
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    form.reset();
    clearSessionStorage();
    await sleep(2000);
    setIsOpen(false);
    toast.success("Message successfully delivered!");
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    form.setValue(
      "attachment",
      e.target.files ? Array.from(e.target.files) : [],
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        setIsOpen(v);
        if (!v) {
          form.setValue("attachment", []);
          setIsLoading(false);
        }
        setIsLoading(false);
      }}
    >
      <form
        id="form"
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { attachment, ...data } = form.getValues();
          setSessionStorageData(JSON.stringify(data));
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4">
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Your name"
                      autoComplete="off"
                      disabled={!!isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Your email"
                      autoComplete="off"
                      disabled={!!isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="subject"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <Input
                      {...field}
                      id="subject"
                      aria-invalid={fieldState.invalid}
                      placeholder="Subject"
                      autoComplete="off"
                      disabled={!!isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <Textarea
                      {...field}
                      id="message"
                      aria-invalid={fieldState.invalid}
                      placeholder="Please describe your issue"
                      autoComplete="off"
                      className="min-h-[120px]"
                      disabled={!!isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="attachment"
                control={form.control}
                render={({ field, fieldState }) => {
                  const files = field.value || [];
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="attachment">Attachment</FieldLabel>
                      <Input
                        ref={fileRef}
                        type="file"
                        hidden
                        id="attachment"
                        name="attachment"
                        onChange={onFileChange}
                        multiple
                        disabled={!!isLoading}
                      />
                      <Button
                        onClick={() => {
                          fileRef.current?.click();
                        }}
                        disabled={!!isLoading} 
                      >
                        <Upload></Upload>
                      </Button>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <AttachmentList
                        files={files}
                        updateFiles={(newFiles) =>
                          form.setValue("attachment", newFiles)
                        }
                      />
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={!!isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="form" disabled={!!isLoading}>
              <Loader
                className="mr-2"
                style={{ display: isLoading ? "inline-block" : "none" }}
              />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

const AttachmentList: React.FC<{
  files: File[];
  updateFiles: (newFiles: File[]) => void;
}> = ({ files, updateFiles }) => {
  if (files.length === 0) return null;
  return (
    <div className="mt-2">
      <strong>Selected files:</strong>
      <ul className="list-disc list-inside">
        {files.map((file: File, index: number) => (
          <li key={index} className="flex flex-wrap gap-2 items-center">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              type="button"
              onClick={() => {
                const newFiles = [...files];
                newFiles.splice(index, 1);
                updateFiles(newFiles);
              }}
            >
              <X />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
