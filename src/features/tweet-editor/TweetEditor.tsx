import React, { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { useCollaboration } from '../../collaboration/useCollaboration';
import { EditableWord } from './EditableWord';
import { IWord, YWord, YProposal } from '../../types';

const HARDCODED_TWEET = "React's component-based architecture is a paradigm shift for building scalable web applications.";

const initializeDoc = (yDoc: Y.Doc) => {
    const yWords = yDoc.getArray<YWord | string>('words');
    if (yWords.length === 0) {
        const words = HARDCODED_TWEET.split(/(\s+)/); // Keep spaces
        words.forEach(wordStr => {
            if (wordStr.trim().length > 0) { // Only make actual words editable
                const yWord: YWord = new Y.Map();
                yWord.set('original', wordStr);
                yWord.set('current', wordStr);
                yWord.set('proposals', new Y.Array<YProposal>());
                yWords.push([yWord]);
            } else { // For spaces, just push a non-editable string
                yWords.push([wordStr]);
            }
        });
    }
};

export const TweetEditor: React.FC = () => {
    const { doc, isSynced } = useCollaboration();
    const [words, setWords] = useState<(IWord | string)[]>([]);

    useEffect(() => {
        // Only initialize once a connection is established
        if (isSynced) {
            // The transaction ensures this initialization is atomic.
            doc.transact(() => {
                initializeDoc(doc);
            });
        }
    }, [doc, isSynced]);

    useEffect(() => {
        const yWords = doc.getArray<YWord | string>('words');

        const updateWordsFromYjs = () => {
            setWords(yWords.toJSON() as (IWord | string)[]);
        };

        // Initial load
        updateWordsFromYjs();

        // Subscribe to changes
        yWords.observe(updateWordsFromYjs);

        return () => {
            yWords.unobserve(updateWordsFromYjs);
        };
    }, [doc]);

    if (!isSynced) {
        return <div>Connecting to collaboration server...</div>;
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Collaborative Tweet Editor</h1>
            <p className="text-lg leading-loose border p-4 rounded-md flex flex-wrap">
                {words.map((wordData, index) =>
                    typeof wordData === 'string' ? (
                        <span key={index}>{wordData}</span>
                    ) : (
                        <EditableWord key={index} wordData={wordData} wordIndex={index} />
                    )
                )}
            </p>
        </div>
    );
};