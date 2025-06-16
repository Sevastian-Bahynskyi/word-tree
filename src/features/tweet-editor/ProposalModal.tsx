import React, { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { useCollaboration } from '../../collaboration/useCollaboration';
import { Modal } from '../../components/ui/Modal';
import { IProposal, YWord } from '../../types';
import { ProposalItem } from './ProposalItem';

interface ProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    wordIndex: number;
    originalWord: string;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ isOpen, onClose, wordIndex, originalWord }) => {
    const { doc } = useCollaboration();
    const [proposals, setProposals] = useState<IProposal[]>([]);
    const [newProposalText, setNewProposalText] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        const yWords = doc.getArray<YWord>('words');
        const yWord = yWords.get(wordIndex);
        const yProposals = yWord.get('proposals') as Y.Array<Y.Map<string | number>>;

        const updateProposals = () => {
            setProposals(yProposals.toJSON());
        };

        updateProposals();
        yProposals.observe(updateProposals);

        return () => yProposals.unobserve(updateProposals);
    }, [doc, wordIndex, isOpen]);

    const handleVote = (proposalIndex: number) => {
        doc.transact(() => {
            const yWord = doc.getArray<YWord>('words').get(wordIndex);
            const yProposals = yWord.get('proposals') as Y.Array<Y.Map<string | number>>;
            const yProposal = yProposals.get(proposalIndex);

            const currentEnergy = yProposal.get('energy') as number;
            yProposal.set('energy', currentEnergy + 10); // Our "energy" system

            // Check if this vote makes it the new winner
            let highestEnergy = -1;
            let winningProposal: IProposal | null = null;

            yProposals.forEach(p => {
                const proposalData = p.toJSON() as IProposal;
                if (proposalData.energy > highestEnergy) {
                    highestEnergy = proposalData.energy;
                    winningProposal = proposalData;
                }
            });

            if (winningProposal) {
                yWord.set('current', winningProposal.text);
            }
        });
    };

    const handleAddProposal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProposalText.trim() === '') return;

        const yProposals = doc.getArray<YWord>('words').get(wordIndex).get('proposals') as Y.Array<Y.Map<any>>;

        const newYProposal = new Y.Map();
        newYProposal.set('text', newProposalText);
        newYProposal.set('energy', 0); // Starts with 0 energy

        yProposals.push([newYProposal]);
        setNewProposalText('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">Proposals for "{originalWord}"</h2>
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {proposals.length === 0 ? (
                    <p className="text-gray-500">No proposals yet. Be the first!</p>
                ) : (
                    proposals
                        .slice() // Create a copy to avoid mutating the state directly
                        .sort((a, b) => b.energy - a.energy) // Display highest energy first
                        .map((p, i) => (
                            <ProposalItem key={p.text + i} proposal={p} onVote={() => handleVote(i)} />
                        ))
                )}
            </div>
            <form onSubmit={handleAddProposal}>
                <input
                    type="text"
                    value={newProposalText}
                    onChange={(e) => setNewProposalText(e.target.value)}
                    className="border rounded w-full p-2"
                    placeholder="Propose a new word..."
                />
                <button type="submit" className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Propose
                </button>
            </form>
        </Modal>
    );
};