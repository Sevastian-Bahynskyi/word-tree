import { useYjs } from '../../providers/YjsProvider';
import { useState, useEffect } from 'react';
import { Awareness } from 'y-protocols/awareness';

// Define a type for the awareness state for better type safety
interface AwarenessState {
    clientId: number;
    user: {
        id: number;
        name: string;
        color: string;
    };
    selectedWordIndex: number | null;
}

const getAwarenessStates = (awareness: Awareness): AwarenessState[] => {
    return Array.from(awareness.getStates().values()) as AwarenessState[];
}

export const useAwareness = () => {
    const { awareness } = useYjs();
    const [states, setStates] = useState<AwarenessState[]>(() => getAwarenessStates(awareness));

    useEffect(() => {
        const updateHandler = () => {
            setStates(getAwarenessStates(awareness));
        };

        awareness.on('update', updateHandler);
        // Initial sync
        updateHandler();

        return () => {
            awareness.off('update', updateHandler);
        };
    }, [awareness]);

    return states;
};