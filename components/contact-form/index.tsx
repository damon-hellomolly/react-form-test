"use client";

import { useState } from "react";
import ContactForm from "@/components/contact-form/contact-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) {
      return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col overflow-hidden p-0 sm:h-auto sm:max-h-[90vh] sm:w-[calc(100vw-2rem)] md:max-w-3xl"
        showCloseButton={false}
        onEscapeKeyDown={(event) => {
          if (isSubmitting) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(event) => {
          if (isSubmitting) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader className="flex-row items-center justify-between gap-2 border-b px-2.5 py-2 sm:gap-3 sm:px-4 sm:py-3">
          <div className="min-w-0">
            <DialogTitle>Contact Us Form</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill in your contact details, complete the CAPTCHA, and submit
              your message.
            </DialogDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => handleOpenChange(false)}
            aria-label="Close dialog"
            className="h-8 min-w-8 px-2.5 sm:h-9 sm:min-w-9 sm:px-3"
            disabled={isSubmitting}
          >
            X
          </Button>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-2.5 sm:px-4 sm:py-4">
          <ContactForm
            formId={contactFormId}
            hideSubmitButton
            onSubmittingChange={setIsSubmitting}
          />
        </div>
        <DialogFooter className="flex-row gap-1.5 border-t px-2.5 py-2.5 sm:gap-2 sm:px-4 sm:py-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="h-9 flex-1 px-2 text-sm sm:flex-none sm:px-3"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={contactFormId}
            disabled={isSubmitting}
            className="h-9 flex-1 px-2 text-sm sm:flex-none sm:px-3"
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ContactForm;
