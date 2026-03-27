"use client";

import { FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// structure for the form data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// structure for the form errors
type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

// initial form data
const INITIAL_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

// validate the form data
function validateContactForm(data: ContactFormData): ContactFormErrors {
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

export default function CustomerForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateContactForm(formData);
    setFormErrors(errors);

    // submit  here.
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter your name"
              value={formData.name}
              onChange={(event) =>
                handleFieldChange("name", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />
            {formErrors.name ? (
              <p className="text-sm text-red-600">{formErrors.name}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={(event) =>
                handleFieldChange("email", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />
            {formErrors.email ? (
              <p className="text-sm text-red-600">{formErrors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="subject" className="text-sm">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              placeholder="Enter a subject"
              value={formData.subject}
              onChange={(event) =>
                handleFieldChange("subject", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />
            {formErrors.subject ? (
              <p className="text-sm text-red-600">{formErrors.subject}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="message" className="text-sm">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="Enter your message"
              value={formData.message}
              onChange={(event) =>
                handleFieldChange("message", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />
            {formErrors.message ? (
              <p className="text-sm text-red-600">{formErrors.message}</p>
            ) : null}
          </div>

          <button type="submit" className="rounded border px-3 py-2">
            Validate Fields
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
