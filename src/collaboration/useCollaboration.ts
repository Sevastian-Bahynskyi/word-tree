import { useContext } from 'react';
import { CollaborationContext } from './CollaborationProvider';

export const useCollaboration = () => {
    const context = useContext(CollaborationContext);
    if (!context) {
        throw new Error('useCollaboration must be used within a CollaborationProvider');
    }
    return context;
};