# React Form Test

Contact form challenge implementation using Next.js + TypeScript + Tailwind CSS.

## Setup Instructions

### Requirements

- Node.js 20+
- pnpm 10+

### Install and Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Commands

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## What Was Implemented

### Requirement 1: Form Fields + Validation

- Fields: `name`, `email`, `subject`, `message`
- Validation rules:
  - `name` >= 2
  - valid `email` format
  - `subject` >= 5
  - `message` >= 10
- Validation runs on input change and on submit
- Field-level error messages are rendered

### Requirement 2: File Upload

- Multiple file upload
- File name + file size display
- Remove single file support
- Total attachment size display
- Total size limit: 25MB
- Limit checked on file selection and again on submit

### Requirement 3: CAPTCHA

- Simple math challenge CAPTCHA
- Refresh CAPTCHA support
- Submit-time validation (required, numeric, correct answer)
- Client-side generation after mount (avoids hydration mismatch)

### Requirement 4: API Simulation

- Simulated submit delay: 2 seconds
- Loading state during submit
- Success toast: `Message successfully delivered`
- Failure toast branch
- Successful submission saved to session storage:
  - key: `contact-form:last-submission`

### Requirement 5: Session Storage Persistence

- Auto-save draft while typing
- Restore draft after refresh/reopen
- Clear draft after successful submit
- Keep successful submission result separately for review
- Draft key:
  - `contact-form:draft`

## Interaction Notes

- `Contact Us Form` opens the form inside a dialog
- During submit:
  - submit button shows loading text
  - form controls are disabled
  - closing the dialog is blocked until submit completes

## Main Files

- `app/page.tsx`
- `components/contact-form/contact-form.tsx`
- `components/contact-form/index.tsx`
- `components/contact-form/contact-form-model.ts`
- `components/contact-form/file-upload.ts`
- `components/contact-form/submit.ts`
- `components/contact-form/session-storage.ts`
