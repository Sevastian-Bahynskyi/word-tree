import React, { useState } from 'react';
import { Word } from './types';
import { ThumbsUp, PlusCircle, MessageCircleDashed, Sparkles } from 'lucide-react';
import { getOrCreateUserId } from '../../lib/userStorageUtil';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    selectedWord: Word | undefined;
    onAddSuggestion: (text: string) => void;
    onVote: (suggestionId: string) => void;
}

const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

export const SuggestionPanel = ({ selectedWord, onAddSuggestion, onVote }: Props) => {
    const [newSuggestion, setNewSuggestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = getOrCreateUserId();

    if (!selectedWord) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-secondary/60 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-xl p-8"
            >
                <div className="flex flex-col items-center justify-center text-center h-48">
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-6"
                    >
                        <MessageCircleDashed size={64} className="text-base/20" />
                    </motion.div>
                    <motion.h4
                        className="font-bold text-xl text-base/70 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Select a Word to Begin
                    </motion.h4>
                    <motion.p
                        className="text-base/50 max-w-sm leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Click on any word above to see existing suggestions or propose your own alternatives
                    </motion.p>
                </div>
            </motion.div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newSuggestion.trim() && !isSubmitting) {
            setIsSubmitting(true);
            onAddSuggestion(newSuggestion.trim());
            setNewSuggestion('');
            setTimeout(() => setIsSubmitting(false), 300);
        }
    };

    const sortedSuggestions = selectedWord.suggestions
        .sort((a, b) => b.votes - a.votes);

    return (
        <motion.div
            className="bg-secondary/60 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-xl p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="flex items-center gap-3 mb-6"
                variants={itemVariants}
            >
                <Sparkles className="text-accent" size={24} />
                <h3 className="text-2xl font-bold">
                    Suggestions for{' '}
                    <span className="text-accent-secondary bg-accent-secondary/10 px-3 py-1 rounded-lg">
                        "{selectedWord.text}"
                    </span>
                </h3>
            </motion.div>

            {/* Suggestions List */}
            <motion.div
                className="mb-8 min-h-[120px]"
                variants={itemVariants}
            >
                <AnimatePresence mode="popLayout">
                    {sortedSuggestions.length > 0 ? (
                        <motion.ul className="space-y-3">
                            {sortedSuggestions.map((sugg, index) => {
                                const userHasVoted = sugg.votedBy.includes(userId);
                                const isAuthor = sugg.authorId === userId;
                                const isTopSuggestion = index === 0 && sugg.votes > 1;

                                return (
                                    <motion.li
                                        layout
                                        key={sugg.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } }}
                                        whileHover={{ scale: 1.02 }}
                                        className={clsx(
                                            "relative overflow-hidden rounded-xl p-4 transition-all duration-200",
                                            {
                                                'bg-gradient-to-r from-accent/20 to-accent-secondary/20 border-2 border-accent/30': isTopSuggestion,
                                                'bg-primary/30 hover:bg-primary/50': !isTopSuggestion
                                            }
                                        )}
                                    >
                                        {isTopSuggestion && (
                                            <motion.div
                                                className="absolute top-2 right-2"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
                                            >
                                                <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    TOP
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-lg">{sugg.text}</span>
                                                {isAuthor && (
                                                    <motion.span
                                                        className="text-xs font-bold bg-accent/20 text-accent px-2 py-1 rounded-full"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        You
                                                    </motion.span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {/* Vote count */}
                                                <motion.div
                                                    className="flex items-center gap-2 text-accent font-bold"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    <ThumbsUp size={16} />
                                                    <AnimatePresence mode="popLayout">
                                                        <motion.span
                                                            key={sugg.votes}
                                                            initial={{ y: -15, opacity: 0, scale: 0.8 }}
                                                            animate={{ y: 0, opacity: 1, scale: 1 }}
                                                            exit={{ y: 15, opacity: 0, scale: 0.8 }}
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 400,
                                                                damping: 20
                                                            }}
                                                        >
                                                            {sugg.votes}
                                                        </motion.span>
                                                    </AnimatePresence>
                                                </motion.div>

                                                {/* Vote button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => onVote(sugg.id)}
                                                    className={clsx(
                                                        "relative p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary shadow-lg",
                                                        {
                                                            'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-accent/25': userHasVoted,
                                                            'bg-primary text-base hover:bg-primary/80 focus:ring-accent/50': !userHasVoted,
                                                        }
                                                    )}
                                                    aria-label={`Vote for suggestion ${sugg.text}`}
                                                >
                                                    <ThumbsUp size={18} />
                                                    {userHasVoted && (
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full bg-accent/20"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: [1, 1.5, 0] }}
                                                            transition={{ duration: 0.4 }}
                                                        />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </motion.ul>
                    ) : (
                        <motion.div
                            key="no-suggestions"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                            className="text-base/60 text-center py-8 bg-primary/20 rounded-xl border-2 border-dashed border-primary/30"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="mb-3"
                            >
                                💡
                            </motion.div>
                            <p className="font-medium">No suggestions yet. Be the first to contribute!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Add Suggestion Form */}
            <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={itemVariants}
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
        </motion.div>
    );
};