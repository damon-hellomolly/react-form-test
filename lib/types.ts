export interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    files: File[];
    captchaText: string;
}

export interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    files?: string;
    captcha?: string;
    form?: string;
}