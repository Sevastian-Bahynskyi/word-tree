import React, { useState } from 'react';
import { Word } from './types';
import { ThumbsUp, PlusCircle, MessageCircleDashed } from 'lucide-react';
import { getOrCreateUserId } from '../../lib/userStorageUtil';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    selectedWord: Word | undefined;
    onAddSuggestion: (text: string) => void;
    onVote: (suggestionId: string) => void;
}

export const SuggestionPanel = ({ selectedWord, onAddSuggestion, onVote }: Props) => {
    const [newSuggestion, setNewSuggestion] = useState('');
    const userId = getOrCreateUserId();

    if (!selectedWord) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col items-center justify-center text-center h-64 bg-secondary rounded-lg border-2 border-dashed border-primary/20"
            >
                <MessageCircleDashed size={48} className="text-base/30 mb-4" />
                <h4 className="font-semibold text-lg text-base/80">Select a Word</h4>
                <p className="text-base/60 max-w-xs mt-1">Click on any word in the sentence above to see or add suggestions.</p>
            </motion.div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSuggestion.trim()) {
            onAddSuggestion(newSuggestion.trim());
            setNewSuggestion('');
        }
    };

    return (
        <div className="mt-8 bg-secondary p-6 rounded-lg shadow-md border border-primary">
            <h3 className="text-xl font-bold mb-4">
                Suggestions for <span className="text-accent-secondary">"{selectedWord.text}"</span>
            </h3>

            <ul className="space-y-3 mb-6 min-h-[5rem]">
                <AnimatePresence>
                    {selectedWord.suggestions.length > 0 ? (
                        selectedWord.suggestions
                            .sort((a, b) => b.votes - a.votes)
                            .map((sugg) => {
                                const userHasVoted = sugg.votedBy.includes(userId);
                                const isAuthor = sugg.authorId === userId;
                                return (
                                    <motion.li
                                        layout
                                        key={sugg.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                        className="flex items-center justify-between bg-primary/50 p-3 rounded-md"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{sugg.text}</span>
                                            {isAuthor && (
                                                <span className="text-xs font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-accent">
                                                <ThumbsUp size={14} />
                                                <AnimatePresence mode="popLayout">
                                                    <motion.span
                                                        key={sugg.votes}
                                                        initial={{ y: -10, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: 10, opacity: 0 }}
                                                        transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                                                    >
                                                        {sugg.votes}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onVote(sugg.id)}
                                                className={clsx(
                                                    "p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary",
                                                    {
                                                        'bg-accent text-white hover:bg-accent/90 focus:ring-accent': userHasVoted,
                                                        'bg-primary text-base hover:bg-primary/80 focus:ring-accent/50': !userHasVoted,
                                                    }
                                                )}
                                                aria-label={`Vote for suggestion ${sugg.text}`}
                                            >
                                                <ThumbsUp size={16} />
                                            </motion.button>
                                        </div>
                                    </motion.li>
                                );
                            })
                    ) : (
                        <motion.div
                            key="no-suggestions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.2 } }}
                            className="text-base/60 text-center py-4"
                        >
                            No suggestions yet. Be the first!
                        </motion.div>
                    )}
                </AnimatePresence>
            </ul>

            <form onSubmit={handleSubmit} className="flex gap-3 mt-4">
                <input
                    type="text"
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    placeholder="Propose a replacement..."
                    className="flex-grow bg-primary border border-primary/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-accent text-white font-bold px-4 py-2 rounded-md hover:bg-accent/90 transition-colors disabled:bg-base/20 disabled:cursor-not-allowed disabled:hover:bg-base/20"
                    disabled={!newSuggestion.trim()}
                >
                    <PlusCircle size={18} />
                    Propose
                </motion.button>
            </form>
        </div>
    );
};