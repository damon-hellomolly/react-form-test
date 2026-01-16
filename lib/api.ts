export async function submitForm(formData: FormData): Promise<{ success: boolean; message?: string }> {
    try {
        // mock network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // here will replace with real api
        // const response = await fetch('/api/submit', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // });

        // const result = await response.json();

        // mock success response
        return { success: true };

        // mock fail response
        // throw new Error('Failed to submit formDetail');
    } catch (error) {
        console.error('Error submitting formDetail:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
}