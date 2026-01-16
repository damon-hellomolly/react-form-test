import React from 'react';

interface FileUploadProps {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    onRemoveFile: (index: number) => void;
    error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles, onRemoveFile, error }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // 检查总大小是否超过25MB
            const newFiles = Array.from(e.target.files);
            const totalSize = files.reduce((sum, file) => sum + file.size, 0) +
                newFiles.reduce((sum, file) => sum + file.size, 0);

            if (totalSize > 25 * 1024 * 1024) {
                alert('Total file size cannot exceed 25MB');
                return;
            }

            setFiles([...files, ...newFiles]);
        }
    };

    const handleRemove = (index: number) => {
        onRemoveFile(index);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Attach Files</label>

            <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                    <div
                        key={index}
                        className={"bg-blue-50 p-2 rounded flex items-center justify-between"}
                    >
                        <div>
                            <span className="text-sm text-blue-700">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Files
                </label>
            </div>

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            {files.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                    Total files: {files.length}, Total size:{' '}
                    {(files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(2)} MB
                </div>
            )}
        </div>
    );
};

export default FileUpload;