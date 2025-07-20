import { useState, useEffect } from 'react';
import { useYjs } from '../../../context/YjsProvider';
import { useTextData } from './useTextData';
import { Word } from '../types';

export interface UseEditorActionsConfig {
    onSelectionChange?: (index: number | null) => void;
}

export interface UseEditorActions {
    isSynced: boolean;
    words: Word[];
    selectedWordIndex: number | null;
    selectedWord: Word | undefined;
    handleWordClick: (index: number) => void;
    handleAddSuggestion: (text: string) => void;
    handleVote: (suggestionId: string) => void;
}

export const useEditorActions = (
    config: UseEditorActionsConfig = {}
): UseEditorActions => {
    const { onSelectionChange } = config;
    const { isSynced, awareness } = useYjs();
    const { words, addSuggestion, voteOnSuggestion } = useTextData();
    const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

    useEffect(() => {
        awareness.setLocalStateField('selectedWordIndex', selectedWordIndex);
        onSelectionChange?.(selectedWordIndex);
    }, [selectedWordIndex, awareness, onSelectionChange]);

    const selectedWord =
        selectedWordIndex !== null ? words[selectedWordIndex] : undefined;

    const handleWordClick = (index: number) => {
        setSelectedWordIndex(prev => (prev === index ? null : index));
    };

    const handleAddSuggestion = (text: string) => {
        if (selectedWordIndex !== null) {
            addSuggestion(selectedWordIndex, text);
        }
    };

    const handleVote = (suggestionId: string) => {
        if (selectedWordIndex !== null) {
            voteOnSuggestion(selectedWordIndex, suggestionId);
        }
    };

    return {
        isSynced,
        words,
        selectedWordIndex,
        selectedWord,
        handleWordClick,
        handleAddSuggestion,
        handleVote,
    };
};
