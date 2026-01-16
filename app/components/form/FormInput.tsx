import React from 'react';

interface FormInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    type?: string;
}

const FormInput: React.FC<FormInputProps> = ({
                                                 label,
                                                 value,
                                                 onChange,
                                                 error,
                                                 placeholder,
                                                 required = false,
                                                 minLength,
                                                 maxLength,
                                                 type = 'text',
                                             }) => {
    return (
        <div className="space-y-1">
            <label htmlFor={label.toLowerCase().replace(' ', '-')} className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                id={label.toLowerCase().replace(' ', '-')}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default FormInput;