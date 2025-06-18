import React from 'react';
import { Word } from './types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useAwareness } from './useAwareness';
import { useYjs } from '../../providers/YjsProvider';

interface Props {
    words: Word[];
    selectedWordIndex: number | null;
    onWordClick: (index: number) => void;
}

export const TextDisplay = ({ words, selectedWordIndex, onWordClick }: Props) => {
    const { provider } = useYjs();
    const awarenessStates = useAwareness();
    const otherUsers = awarenessStates.filter(state => state.clientId !== provider.awareness.clientID && state.user);

    return (
        <div className="relative">
            <motion.div
                className="text-3xl md:text-4xl leading-relaxed font-medium text-base/90 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {words.map((word, index) => {
                    const selectionsOnThisWord = otherUsers.filter(u => u.selectedWordIndex === index);
                    const isSelected = selectedWordIndex === index;
                    const hasSuggestions = word.suggestions.length > 0;

                    return (
                        <React.Fragment key={word.id}>
                            <motion.span
                                className="relative inline-block group mx-1"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                {/* Selection highlight */}
                                {isSelected && (
                                    <motion.span
                                        layoutId="highlight"
                                        className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-secondary/20 rounded-lg -m-1 z-0"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}

                                {/* Hover effect */}
                                <motion.span
                                    className="absolute inset-0 bg-primary/30 rounded-lg -m-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    initial={false}
                                />

                                {/* Word text */}
                                <motion.span
                                    onClick={() => onWordClick(index)}
                                    className={clsx(
                                        "relative z-10 cursor-pointer px-2 py-1 rounded-lg transition-all duration-300 select-none",
                                        {
                                            'text-accent font-bold shadow-lg': isSelected,
                                            'hover:text-accent/80': !isSelected,
                                            'ring-2 ring-accent-secondary/30': hasSuggestions && !isSelected,
                                        }
                                    )}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {word.text}
                                </motion.span>

                                {/* Suggestion indicator */}
                                {hasSuggestions && !isSelected && (
                                    <motion.div
                                        className="absolute -top-2 -right-1 w-3 h-3 bg-accent-secondary rounded-full shadow-lg z-20"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 400, delay: index * 0.1 + 0.3 }}
                                    >
                                        <motion.div
                                            className="w-full h-full bg-accent-secondary rounded-full"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>
                                )}

                                {/* Other users' selections */}
                                {selectionsOnThisWord.length > 0 && (
                                    <motion.div
                                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none z-10"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {selectionsOnThisWord.map(({ clientId, user }) => (
                                            <motion.div
                                                key={clientId}
                                                className="relative"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <div
                                                    className="h-2.5 w-2.5 rounded-full ring-2 ring-secondary shadow-sm"
                                                    style={{ backgroundColor: user.color }}
                                                    title={user.name}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 rounded-full"
                                                    style={{ backgroundColor: user.color }}
                                                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.span>
                        </React.Fragment>
                    );
                })}
            </motion.div>

            {/* Instruction text */}
            <motion.p
                className="text-center text-base/50 text-sm mt-6 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                Click on any word to view or add suggestions
            </motion.p>
        </div>
    );
};