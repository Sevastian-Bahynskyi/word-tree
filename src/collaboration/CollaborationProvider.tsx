import React, { createContext, useEffect, useMemo } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface CollaborationContextType {
    doc: Y.Doc;
    provider: WebsocketProvider;
    isSynced: boolean;
}

export const CollaborationContext = createContext<CollaborationContextType | null>(null);

// NOTE: This public Y-Websocket server is for demo purposes only.
// For a production app, you would run your own y-websocket server.
const WEBSOCKET_ENDPOINT = 'wss://demos.yjs.dev';

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { doc, provider } = useMemo(() => {
        const doc = new Y.Doc();
        const provider = new WebsocketProvider(WEBSOCKET_ENDPOINT, 'twitter-collab-room', doc);
        return { doc, provider };
    }, []);

    const [isSynced, setIsSynced] = React.useState(false);

    useEffect(() => {
        const onSync = (synced: boolean) => {
            console.log('Sync status changed:', synced);
            setIsSynced(synced);
        };

        provider.on('sync', onSync);

        return () => {
            provider.off('sync', onSync);
            // Disconnecting the provider will also destroy the doc
            provider.disconnect();
        };
    }, [provider]);

    const value = { doc, provider, isSynced };

    return (
        <CollaborationContext.Provider value={value}>
            {children}
        </CollaborationContext.Provider>
    );
};