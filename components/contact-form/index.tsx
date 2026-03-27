"use client";

import ContactForm from "@/components/contact-form/contact-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type { ContactFormProps } from "@/components/contact-form/contact-form";
export type ContactFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ContactFormDialog({
  open,
  onOpenChange,
}: ContactFormDialogProps) {
  const contactFormId = "contact-us-form";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0" showCloseButton={false}>
        <DialogHeader className="flex-row items-center justify-between gap-3 border-b px-4 py-3">
          <DialogTitle>Contact Us Form</DialogTitle>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
          >
            X
          </Button>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
          <ContactForm formId={contactFormId} hideSubmitButton />
        </div>
        <DialogFooter className="border-t px-4 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form={contactFormId}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ContactForm;
