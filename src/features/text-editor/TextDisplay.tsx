import React from 'react';
import { Word } from './types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface Props {
    words: Word[];
    selectedWordIndex: number | null;
    onWordClick: (index: number, element: HTMLElement) => void;
}

export const TextDisplay = ({ words, selectedWordIndex, onWordClick }: Props) => {
    return (
        <div className="relative">
            {/* Breathing container with glow effect */}
            <motion.div
                className="relative p-8 rounded-2xl"
                animate={{
                    scale: [1, 1.005, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.4, 0.0, 0.6, 1.0] // Custom easing for natural breathing
                }}
                style={{
                    background: `radial-gradient(ellipse at center, 
                        var(--color-accent) 0%, 
                        transparent 30%), 
                        radial-gradient(ellipse at center, 
                        var(--color-primary) 0%, 
                        var(--color-secondary) 100%)`,
                    backgroundBlendMode: 'overlay',
                    boxShadow: `0 0 40px var(--color-accent-secondary)`,
                    filter: 'blur(0px)'
                }}
            >
                {/* Pulsing glow overlay */}
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        background: `radial-gradient(circle at center, 
                            var(--color-accent) 0%, 
                            transparent 60%)`,
                        mixBlendMode: 'soft-light'
                    }}
                />

                <motion.div
                    className="text-3xl md:text-4xl leading-relaxed font-medium text-base/90 text-center relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >{words.map((word, index) => {
                    const isSelected = selectedWordIndex === index;
                    const hasSuggestions = word.suggestions.length > 0;

                    return (
                        <React.Fragment key={word.id}>                            <motion.span
                            className="relative inline-block group mx-1"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >                            {/* Flying particles effect on selection */}
                            {isSelected && (
                                <>
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={`${word.id}-particle-${i}`}
                                            className="absolute w-2 h-2 bg-accent rounded-full pointer-events-none z-0"
                                            initial={{
                                                x: 0,
                                                y: 0,
                                                scale: 0,
                                                opacity: 0
                                            }}
                                            animate={{
                                                x: (Math.random() - 0.5) * 200 + (Math.cos((i / 8) * Math.PI * 2) * 60),
                                                y: (Math.random() - 0.5) * 200 + (Math.sin((i / 8) * Math.PI * 2) * 60),
                                                scale: [0, 1, 0.8, 0],
                                                opacity: [0, 1, 0.8, 0]
                                            }}
                                            transition={{
                                                duration: 1.5 + Math.random() * 0.5,
                                                ease: "easeOut",
                                                delay: Math.random() * 0.2
                                            }}
                                            style={{
                                                left: '50%',
                                                top: '50%'
                                            }}
                                        />
                                    ))}

                                    {/* Additional sparkle particles */}
                                    {[...Array(12)].map((_, i) => (
                                        <motion.div
                                            key={`${word.id}-sparkle-${i}`}
                                            className="absolute w-1 h-1 bg-accent-secondary rounded-full pointer-events-none z-0"
                                            initial={{
                                                x: 0,
                                                y: 0,
                                                scale: 0,
                                                opacity: 0,
                                                rotate: 0
                                            }}
                                            animate={{
                                                x: (Math.random() - 0.5) * 300,
                                                y: (Math.random() - 0.5) * 300,
                                                scale: [0, 1.5, 1, 0],
                                                opacity: [0, 0.8, 0.6, 0],
                                                rotate: 360
                                            }}
                                            transition={{
                                                duration: 2 + Math.random() * 1,
                                                ease: [0.25, 0.46, 0.45, 0.94],
                                                delay: Math.random() * 0.3
                                            }}
                                            style={{
                                                left: '50%',
                                                top: '50%'
                                            }}
                                        />
                                    ))}
                                </>
                            )}

                            {/* Selection highlight */}
                            {isSelected && (
                                <motion.span
                                    layoutId="highlight"
                                    className="absolute inset-0 bg-accent/20 rounded-lg -m-1 z-0"
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

                            {/* Word text */}                            <motion.span
                                onClick={(e) => onWordClick(index, e.currentTarget as HTMLElement)}
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
                                    />                                </motion.div>
                            )}
                        </motion.span>
                        </React.Fragment>
                    );
                })}
                </motion.div>
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