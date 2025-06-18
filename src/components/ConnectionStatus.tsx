import { useEffect, useState } from 'react';
import { useYjs } from '../providers/YjsProvider';
import { Users } from 'lucide-react';
import { getOrCreateUserId } from '../lib/userStorageUtil';

export const ConnectionStatus = () => {
    const { awareness, isSynced } = useYjs();
    const [playerCount, setPlayerCount] = useState(0);

    useEffect(() => {
        const userId = getOrCreateUserId();
        awareness.setLocalStateField('user', {
            name: 'User-' + userId.substring(0, 4),
            userId: userId,
        });

        const updatePlayerCount = () => {
            const states = Array.from(awareness.getStates().values());
            const uniqueUserIds = new Set(states.map(state => state.user?.userId).filter(Boolean));
            setPlayerCount(uniqueUserIds.size);
        };

        awareness.on('change', updatePlayerCount);
        updatePlayerCount();

        return () => {
            awareness.off('change', updatePlayerCount);
        };
    }, [awareness]);

    const statusColor = isSynced ? 'bg-green-500' : 'bg-yellow-500';

    return (
        <div className="fixed top-4 right-4 flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-full shadow-lg border border-gray-700">
            <div className={`w-3 h-3 rounded-full ${statusColor} transition-colors`}></div>
            <Users size={18} />
            <span className="font-medium">{playerCount}</span>
        </div>
    );
};