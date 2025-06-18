import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness';

interface YjsContextType {
    doc: Y.Doc;
    provider: WebsocketProvider;
    awareness: Awareness; // <-- Add awareness to the context
    isSynced: boolean;
}

const YjsContext = createContext<YjsContextType | null>(null);

export const YjsProvider = ({ children }: { children: React.ReactNode }) => {
    const [contextValue, setContextValue] = useState<YjsContextType | null>(null);

    useEffect(() => {
        const doc = new Y.Doc();
        const provider = new WebsocketProvider('ws://localhost:8080', 'daily-tweet-room', doc);
        const awareness = provider.awareness; // <-- Get awareness instance

        const handleSync = (isSynced: boolean) => {
            setContextValue(prev => {
                const value = prev ?? { doc, provider, awareness, isSynced: false };
                return { ...value, isSynced };
            });
        };

        provider.on('sync', () => handleSync(true));
        provider.on('status', (event: { status: string }) => {
            if (event.status !== 'connected') handleSync(false);
        });

        setContextValue({ doc, provider, awareness, isSynced: false });

        return () => {
            provider.disconnect();
            doc.destroy();
        };
    }, []);

    if (!contextValue) {
        return <div>Connecting to collaboration server...</div>;
    }

    return (
        <YjsContext.Provider value={contextValue}>
            {children}
        </YjsContext.Provider>
    );
};

export const useYjs = () => {
    const context = useContext(YjsContext);
    if (!context) {
        throw new Error('useYjs must be used within a YjsProvider');
    }
    return context;
};