import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

interface Props {
    onAddSuggestion: (text: string) => void;
}

export const AddSuggestionForm = ({ onAddSuggestion }: Props) => {
    const [newSuggestion, setNewSuggestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newSuggestion.trim() && !isSubmitting) {
            setIsSubmitting(true);
            onAddSuggestion(newSuggestion.trim());
            setNewSuggestion('');
            setTimeout(() => setIsSubmitting(false), 300);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <div className="relative">
                <input
                    type="text"
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    placeholder="Propose your alternative..."
                    className="w-full bg-primary/50 border-2 border-primary/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 placeholder-base/40"
                    disabled={isSubmitting}
                />
                {newSuggestion.trim() && (
                    <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    </motion.div>
                )}
            </div>

            <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!newSuggestion.trim() || isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-accent to-accent-secondary text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {isSubmitting ? (
                    <>
                        <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Adding...
                    </>
                ) : (
                    <>
                        <PlusCircle size={20} />
                        Propose Alternative
                    </>
                )}
            </motion.button>
        </motion.form>
    );
};
