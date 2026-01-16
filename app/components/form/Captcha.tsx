import React from 'react';

interface CaptchaProps {
    captchaText: string;
    setCaptchaValue: React.Dispatch<React.SetStateAction<string>>;
    error?: string;
}

const Captcha: React.FC<CaptchaProps> = ({ captchaText, setCaptchaValue, error }) => {

    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">CAPTCHA Verification</label>
            <div className="flex gap-2">
                <div className="bg-gray-100 p-2 rounded flex-grow">
                    <span className="text-sm text-gray-700">{captchaText}</span>
                </div>
                <input
                    type="text"
                    // value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    placeholder="Enter result"
                    className="w-32 px-3 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Captcha;