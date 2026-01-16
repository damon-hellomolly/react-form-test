import { FormData} from "@/lib/types";

export function autoSaveForm(formData: FormData): void {
    try {
        sessionStorage.setItem('formData', JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
}

export function restoreFormData(): FormData | null {
    try {
        const savedData = sessionStorage.getItem('formData');
        return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
        console.error('Error restoring from sessionStorage:', error);
        return null;
    }
}

export function clearFormData(): void {
    try {
        sessionStorage.removeItem('formData');
    } catch (error) {
        console.error('Error clearing sessionStorage:', error);
    }
}