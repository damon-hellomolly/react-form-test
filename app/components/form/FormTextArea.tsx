import React from 'react';

interface FormTextAreaProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    rows?: number;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
                                                       label,
                                                       value,
                                                       onChange,
                                                       error,
                                                       placeholder,
                                                       required = false,
                                                       minLength,
                                                       maxLength,
                                                       rows = 5,
                                                   }) => {
    return (
        <div className="space-y-1">
            <label htmlFor={label.toLowerCase().replace(' ', '-')} className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
                id={label.toLowerCase().replace(' ', '-')}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
                rows={rows}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default FormTextArea;