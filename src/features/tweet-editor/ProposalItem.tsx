import React from 'react';
import { IProposal } from '../../types';

interface ProposalItemProps {
    proposal: IProposal;
    onVote: () => void;
}

export const ProposalItem: React.FC<ProposalItemProps> = ({ proposal, onVote }) => {
    return (
        <div className="flex justify-between items-center p-2 border rounded">
            <div>
                <span className="font-semibold">{proposal.text}</span>
                <span className="ml-2 text-sm text-gray-500">⚡ {proposal.energy}</span>
            </div>
            <button
                onClick={onVote}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
                Vote
            </button>
        </div>
    );
};