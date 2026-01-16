import React from 'react';

interface SubmitButtonProps {
    isSubmitting: boolean;
    text: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, text }) => {
    return (
        <button
            type="submit"
            className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Submitting...' : text}
        </button>
    );
};

export default SubmitButton;