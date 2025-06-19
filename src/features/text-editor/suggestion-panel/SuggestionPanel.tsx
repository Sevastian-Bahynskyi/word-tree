import { Word } from '../types';
import { Sparkles, Lightbulb } from 'lucide-react';
import { getOrCreateUserId } from '../../../lib/userStorageUtil';
import { AnimatePresence, motion } from 'framer-motion';
import { EmptyState } from './EmptyState';
import { SuggestionItem } from './SuggestionItem';
import { AddSuggestionForm } from './AddSuggestionForm';

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
    const userId = getOrCreateUserId();

    if (!selectedWord) {
        return <EmptyState />;
    }

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
                    </span>                </h3>
            </motion.div>

            {/* Suggestions List */}
            <motion.div
                className="mb-8 min-h-[120px]"
                variants={itemVariants}
            >
                <AnimatePresence mode="popLayout">
                    {sortedSuggestions.length > 0 ? (
                        <motion.ul className="space-y-3">
                            {sortedSuggestions.map((sugg, index) => (
                                <SuggestionItem
                                    key={sugg.id}
                                    suggestion={sugg}
                                    index={index}
                                    userId={userId}
                                    onVote={onVote}
                                />
                            ))}
                        </motion.ul>
                    ) : (
                        <motion.div
                            key="no-suggestions"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                            className=" text-center py-8 bg-primary/20 rounded-xl border-2 border-dashed border-primary/30"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className='flex items-center justify-center mb-4'
                            >
                                <Lightbulb size={48} className="text-accent mb-4" />
                            </motion.div>
                            <p className="font-medium">No suggestions yet. Be the first to contribute!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Add Suggestion Form */}
            <motion.div variants={itemVariants}>
                <AddSuggestionForm onAddSuggestion={onAddSuggestion} />
            </motion.div>
        </motion.div>
    );
};