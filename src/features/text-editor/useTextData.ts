import { useEffect, useState, useMemo } from 'react';
import * as Y from 'yjs';
import { useYjs } from '../../providers/YjsProvider';
import { Word, Suggestion } from './types';
import { getOrCreateUserId } from '../../lib/userStorageUtil';

const MOCK_TEXT = "React is a JavaScript library for building user interfaces.";

const ySuggestionToSuggestion = (yMap: Y.Map<any>): Suggestion => ({
    id: yMap.get('id'),
    text: yMap.get('text'),
    votes: yMap.get('votes'),
    authorId: yMap.get('authorId'),
    votedBy: yMap.get('votedBy')?.toArray() ?? [],
});

const yWordToWord = (yMap: Y.Map<any>): Word => ({
    id: yMap.get('id'),
    text: yMap.get('text'),
    suggestions: yMap.get('suggestions').toArray().map(ySuggestionToSuggestion),
});

export const useTextData = () => {
    const { doc, isSynced } = useYjs();
    const [words, setWords] = useState<Word[]>([]);

    const yWords = useMemo(() => doc.getArray<Y.Map<any>>('text-words'), [doc]);
    const yMeta = useMemo(() => doc.getMap('text-meta'), [doc]);

    useEffect(() => {
        const initializeData = () => {
            if (yMeta.get('initialized')) {
                setWords(yWords.toArray().map(yWordToWord));
                return;
            };

            doc.transact(() => {
                // Double-check inside transaction to prevent race conditions
                if (yWords.length > 0) {
                    yMeta.set('initialized', true);
                    return;
                }
                const initialWords = MOCK_TEXT.split(' ').map((text, index) => {
                    const wordMap = new Y.Map();
                    wordMap.set('id', `word-${index}-${Date.now()}`);
                    wordMap.set('text', text);
                    wordMap.set('suggestions', new Y.Array());
                    return wordMap;
                });
                yWords.push(initialWords);
                yMeta.set('initialized', true);
            });
            setWords(yWords.toArray().map(yWordToWord));
        };

        if (isSynced) {
            initializeData();
        }

        const observer = () => {
            setWords(yWords.toArray().map(yWordToWord));
        };

        yWords.observeDeep(observer);
        return () => yWords.unobserveDeep(observer);
    }, [isSynced, doc, yWords, yMeta]);

    const addSuggestion = (wordIndex: number, suggestionText: string) => {
        const wordMap = yWords.get(wordIndex);
        if (!wordMap) return;

        const authorId = getOrCreateUserId();
        const suggestionsArray = wordMap.get('suggestions') as Y.Array<Y.Map<any>>;

        // Prevent duplicate suggestions
        const existingSuggestion = suggestionsArray.toArray().some(s => s.get('text').toLowerCase() === suggestionText.toLowerCase());
        if (existingSuggestion) return;

        const suggestionMap = new Y.Map();

        suggestionMap.set('id', `sugg-${crypto.randomUUID()}`);
        suggestionMap.set('text', suggestionText);
        suggestionMap.set('authorId', authorId);

        const votedByArray = new Y.Array<string>();
        votedByArray.push([authorId]); // Creator auto-votes
        suggestionMap.set('votedBy', votedByArray);
        suggestionMap.set('votes', 1);

        suggestionsArray.push([suggestionMap]);
    };

    const voteOnSuggestion = (wordIndex: number, suggestionId: string) => {
        const wordMap = yWords.get(wordIndex);
        if (!wordMap) return;

        const suggestionsArray = wordMap.get('suggestions') as Y.Array<Y.Map<any>>;
        const suggestionMap = suggestionsArray.toArray().find(s => s.get('id') === suggestionId);
        if (!suggestionMap) return;

        const votedByArray = suggestionMap.get('votedBy') as Y.Array<string>;
        const userId = getOrCreateUserId();
        const userIndex = votedByArray.toArray().indexOf(userId);

        doc.transact(() => {
            if (userIndex > -1) {
                votedByArray.delete(userIndex, 1);
            } else {
                votedByArray.push([userId]);
            }
            suggestionMap.set('votes', votedByArray.length);
        });
    };

    return { words, addSuggestion, voteOnSuggestion };
};