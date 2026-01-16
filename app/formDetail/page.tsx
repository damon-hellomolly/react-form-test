'use client';

import { useState, useEffect } from 'react';
import FormInput from '../components/form/FormInput';
import FormTextArea from '../components/form/FormTextArea';
import FileUpload from '../components/form/FileUpload';
import Captcha from '../components/form/Captcha';
import SubmitButton from '../components/form/SubmitButton';
import SuccessModal from '../components/form/SuccessModal';
import { autoSaveForm, restoreFormData, clearFormData } from '@/lib/sessionStorage';
import { submitForm } from '@/lib/api';
import {FormErrors, FormData} from "@/lib/types";

export default function Home() {
    // form field
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [captchaText, setCaptchaText] = useState('');

    // UI
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formKey, setFormKey] = useState(0); // reset form

    // restore form
    useEffect(() => {
        const savedData = restoreFormData();
        if (savedData) {
            setName(savedData.name || '');
            setEmail(savedData.email || '');
            setSubject(savedData.subject || '');
            setMessage(savedData.message || '');
            setFiles(savedData.files || []);
            setCaptchaText(savedData.captchaText || generateCaptcha());
        } else {
            setCaptchaText(generateCaptcha());
        }
    }, []);

    // auto save form field to sessionStorage
    useEffect(() => {
        const formData: FormData = {
            name,
            email,
            subject,
            message,
            files: files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            })),
            captchaText
        };
        autoSaveForm(formData);
    }, [name, email, subject, message, files, captchaText]);

    // generate captcha
    function generateCaptcha(): string {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        return `${num1} + ${num2}`;
    }

    // calculate captcha result
    function calculateCaptchaResult(): number {
        const parts = captchaText.split('+');
        return parseInt(parts[0].trim()) + parseInt(parts[1].trim());
    }

    // submit form
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});

        // validate form
        const newErrors: FormErrors = {};
        if (!name || name.length < 2) newErrors.name = 'Name must be at least 2 characters';
        if (!email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email is not valid';
        if (!subject || subject.length < 5) newErrors.subject = 'Subject must be at least 5 characters';
        if (!message || message.length < 10) newErrors.message = 'Message must be at least 10 characters';

        // validate file
        if (files.length === 0) {
            newErrors.files = 'Please upload at least one file';
        } else {
            let totalSize = 0;
            for (const file of files) {
                totalSize += file.size;
            }
            if (totalSize > 25 * 1024 * 1024) { // 25MB in bytes
                newErrors.files = 'Total file size cannot exceed 25MB';
            }
        }

        // validate captcha
        if (!captchaValue) {
            newErrors.captcha = 'Please complete the CAPTCHA';
        } else if (parseInt(captchaValue) !== calculateCaptchaResult()) {
            newErrors.captcha = 'CAPTCHA is incorrect';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // submit form
        setIsSubmitting(true);
        try {
            const result = await submitForm({
                name,
                email,
                subject,
                message,
                files: files.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }))
            });

            if (result.success) {
                setShowSuccess(true);
                // clear out sessionStorage
                clearFormData();
                // reset form
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
                setFiles([]);
                setCaptchaText(generateCaptcha());
                // set to re-render the form
                setFormKey(prev => prev + 1);
            } else {
                setErrors({ form: result.message || 'Submission failed. Please try again.' });
            }
        } catch (error) {
            setErrors({ form: 'An error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    // remove file
    const handleRemoveFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Contact Us</h1>

                <form onSubmit={handleSubmit} key={formKey}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Name Field */}
                        <FormInput
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={errors.name}
                            placeholder="Enter your full name"
                            required
                            minLength={2}
                        />

                        {/* Email Field */}
                        <FormInput
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            placeholder="Enter your email address"
                            required
                            type="email"
                        />
                    </div>

                    <div className="mb-6">
                        {/* Subject Field */}
                        <FormInput
                            label="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            error={errors.subject}
                            placeholder="Enter the subject"
                            required
                            minLength={5}
                        />
                    </div>

                    <div className="mb-6">
                        {/* Message Field */}
                        <FormTextArea
                            label="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            error={errors.message}
                            placeholder="Enter your message"
                            rows={5}
                            required
                            minLength={10}
                        />
                    </div>

                    <div className="mb-6">
                        {/* File Upload Field */}
                        <FileUpload
                            files={files}
                            setFiles={setFiles}
                            onRemoveFile={handleRemoveFile}
                            error={errors.files}
                        />
                    </div>

                    <div className="mb-6">
                        {/* CAPTCHA Field */}
                        <Captcha
                            captchaText={captchaText}
                            setCaptchaValue={setCaptchaValue}
                            error={errors.captcha}
                        />
                    </div>

                    {/* Error display for formDetail submission errors */}
                    {errors.form && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded border border-red-400">
                            {errors.form}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            text="Submit"
                        />
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <SuccessModal
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </div>
    );
}