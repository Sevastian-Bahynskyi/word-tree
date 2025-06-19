import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';
import { Suggestion } from '../types';
import clsx from 'clsx';

interface Props {
    suggestion: Suggestion;
    index: number;
    userId: string;
    onVote: (suggestionId: string) => void;
}

export const SuggestionItem = ({ suggestion, index, userId, onVote }: Props) => {
    const userHasVoted = suggestion.votedBy.includes(userId);
    const isAuthor = suggestion.authorId === userId;
    const isTopSuggestion = index === 0 && suggestion.votes > 1;

    return (
        <motion.li
            layout
            key={suggestion.id}
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
                    className="absolute top-1 right-1 z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
                >
                    <div className="bg-accent/45 text-white text-xs font-bold px-2 py-1 rounded-full">
                        TOP
                    </div>
                </motion.div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg">{suggestion.text}</span>
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
                                key={suggestion.votes}
                                initial={{ y: -15, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 15, opacity: 0, scale: 0.8 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 20
                                }}
                            >
                                {suggestion.votes}
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>

                    {/* Vote button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onVote(suggestion.id)}
                        className={clsx(
                            "relative p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary shadow-lg z-0",
                            {
                                'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-accent/25': userHasVoted,
                                'bg-primary text-base hover:bg-primary/80 focus:ring-accent/50': !userHasVoted,
                            }
                        )}
                        aria-label={`Vote for suggestion ${suggestion.text}`}
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
};
