import { ContactFormData, ContactFormErrors } from "@/components/custom-form/types";

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
