import { useState, useEffect } from 'react';
import { TextDisplay } from './TextDisplay';
import { SuggestionPanel } from './SuggestionPanel';
import { useTextData } from './useTextData';
import { useYjs } from '../../providers/YjsProvider';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

export const CollaborativeEditor = () => {
    const { isSynced, awareness } = useYjs();
    const { words, addSuggestion, voteOnSuggestion } = useTextData();
    const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

    // Update awareness state when a word is selected
    useEffect(() => {
        awareness.setLocalStateField('selectedWordIndex', selectedWordIndex);
    }, [selectedWordIndex, awareness]);

    if (!words.length) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent mx-auto"></div>
                    <p className="mt-4 text-lg text-base/80">{!isSynced ? "Connecting to server..." : "Initializing document..."}</p>
                </div>
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
        setSelectedWordIndex(prevIndex => prevIndex === index ? null : index);
    }

    return (
        <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center antialiased">
            <motion.div
                className="w-full max-w-4xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.header variants={itemVariants} className="text-center mb-8 md:mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-secondary">
                        Word Weave
                    </h1>
                    <p className="text-base/80 mt-2">Modify the text by proposing and voting on word replacements.</p>
                </motion.header>

                <motion.section variants={itemVariants}>
                    <TextDisplay
                        words={words}
                        selectedWordIndex={selectedWordIndex}
                        onWordClick={handleWordClick}
                    />
                </motion.section>

                <motion.section variants={itemVariants}>
                    <SuggestionPanel
                        selectedWord={selectedWord}
                        onAddSuggestion={handleAddSuggestion}
                        onVote={handleVote}
                    />
                </motion.section>
            </motion.div>
        </main>
    );
};