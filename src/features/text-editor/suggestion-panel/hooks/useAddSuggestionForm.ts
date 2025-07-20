import { useState } from 'react';

export const useAddSuggestionForm = (
    onAddSuggestion: (text: string) => void
) => {
    const [newSuggestion, setNewSuggestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = () => {
        if (newSuggestion.trim() && !isSubmitting) {
            setIsSubmitting(true);
            onAddSuggestion(newSuggestion.trim());
            setNewSuggestion('');
            setTimeout(() => setIsSubmitting(false), 300);
        }
    };

    return {
        newSuggestion,
        setNewSuggestion,
        isSubmitting,
        submit,
    };
};
