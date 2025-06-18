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
        <p className="relative text-2xl md:text-3xl leading-relaxed bg-secondary p-8 rounded-lg shadow-md border border-primary">
            {words.map((word, index) => {
                const selectionsOnThisWord = otherUsers.filter(u => u.selectedWordIndex === index);

                return (
                    <React.Fragment key={word.id}>
                        <span className="relative inline-block group">
                            {selectedWordIndex === index && (
                                <motion.span
                                    layoutId="highlight"
                                    className="absolute inset-0 bg-accent/20 rounded-md z-0"
                                    initial={{ borderRadius: 8 }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span
                                onClick={() => onWordClick(index)}
                                className={clsx(
                                    "relative z-10 cursor-pointer px-1 py-0.5 rounded-md transition-colors duration-200",
                                    { 'text-accent font-semibold': selectedWordIndex === index },
                                    { 'group-hover:bg-primary/50': selectedWordIndex !== index }
                                )}
                            >
                                {word.text}
                            </span>
                            {selectionsOnThisWord.length > 0 && (
                                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                                    {selectionsOnThisWord.map(({ clientId, user }) => (
                                        <span
                                            key={clientId}
                                            className="h-2 w-2 rounded-full ring-2 ring-secondary"
                                            style={{ backgroundColor: user.color }}
                                            title={user.name}
                                        />
                                    ))}
                                </div>
                            )}
                        </span>
                        {' '}
                    </React.Fragment>
                );
            })}
        </p>
    );
};