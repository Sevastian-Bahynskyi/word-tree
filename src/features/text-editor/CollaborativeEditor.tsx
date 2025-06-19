import { useState, useEffect } from 'react';
import { TextDisplay } from './TextDisplay';
import { SuggestionPanel } from './suggestion-panel/SuggestionPanel';
import { useTextData } from './useTextData';
import { useYjs } from '../../providers/YjsProvider';
import { motion, type Variants } from 'framer-motion';
import AnimatedText from '../../components/AnimatedText';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 120,
            damping: 15,
        },
    },
};

const pulseVariants: Variants = {
    pulse: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1], // cubic-bezier equivalent of easeInOut
        },
    },
};

export const CollaborativeEditor = () => {
    const { isSynced, awareness } = useYjs();
    const { words, addSuggestion, voteOnSuggestion } = useTextData();
    const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

    useEffect(() => {
        awareness.setLocalStateField('selectedWordIndex', selectedWordIndex);
    }, [selectedWordIndex, awareness]);

    if (!words.length) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-primary to-secondary">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full mx-auto mb-6"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.p
                        className="text-lg text-base/70 font-medium"
                        variants={pulseVariants}
                        initial="pulse"
                        animate="pulse"
                    >
                        {!isSynced ? 'Connecting to server...' : 'Initializing document...'}
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    const selectedWord = selectedWordIndex !== null ? words[selectedWordIndex] : undefined;

    const handleAddSuggestion = (text: string) => {
        if (selectedWordIndex !== null) addSuggestion(selectedWordIndex, text);
    };

    const handleVote = (suggestionId: string) => {
        if (selectedWordIndex !== null) voteOnSuggestion(selectedWordIndex, suggestionId);
    };

    const handleWordClick = (index: number) => {
        setSelectedWordIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >                    {/* Header */}
                    <motion.header variants={itemVariants} className="text-center">
                        <div className="h-64 -mx-4 -mt-8 mb-4">
                            <AnimatedText
                                text="Word Tree"
                                fontSize={80}
                                letterSpacing={5}
                            />
                        </div>
                        <motion.p
                            className="text-base/60 text-lg max-w-2xl mx-auto leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Collaborate in real-time by proposing and voting on word replacements
                        </motion.p>
                    </motion.header>

                    {/* Text Display Section */}
                    <motion.section variants={itemVariants} className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent-secondary/5 rounded-2xl blur-xl" />
                        <div className="relative bg-secondary/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 shadow-xl">
                            <TextDisplay
                                words={words}
                                selectedWordIndex={selectedWordIndex}
                                onWordClick={handleWordClick}
                            />
                        </div>
                    </motion.section>

                    {/* Suggestions Panel */}
                    <motion.section variants={itemVariants} className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-secondary/5 to-accent/5 rounded-2xl blur-xl" />
                        <div className="relative">
                            <SuggestionPanel
                                selectedWord={selectedWord}
                                onAddSuggestion={handleAddSuggestion}
                                onVote={handleVote}
                            />
                        </div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
};
